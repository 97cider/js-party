<template>
  <div id="app">
    <Header v-on:playUrl="addVideo"  v-on:addToQueue="addVideoToQueue" 
      v-on:toggleSideMenu="minimizedSidebar = !minimizedSidebar" v-on:closeSideMenu="minimizedSidebar = false">
      <SearchBar  v-on:playUrl="addVideo"  v-on:addToQueue="addVideoToQueue" v-on:addToQueueById="addVideoToQueueById" v-on:playById="playVideoById"/>
    </Header>
    
    <div v-show="!username">
      <JoinPrompt v-on:joinRoom="joinRoom"/>
    </div>
    
    <SideMenu :isExpanded="!minimizedSidebar">
      <div>Room ID = {{ $route.params.roomId }}</div>
      <div>
        List of users:
          <li v-for="client in this.clients" :key="client">
            UserName: {{ client }}
          </li>
            <!-- {{ client }}
          </li> -->
      </div>

      <div>
        Current Media Queue:
          <li v-for="item in this.queueContent" :key="item">
            <QueueElement :songName="item.title" :url="item.url"/>
          </li>
      </div>

      <button v-on:click="pauseVideo">Pause Video!</button>
      <button v-on:click="setVideoTimeDev">Set Time Test!</button>

      <input type="checkbox" id="checkbox" v-on:change="toggleLooping" v-model="isLooping">
      <label for="checkbox">Loop Playlist: {{ isLooping }}</label>

      <button v-on:click="enableShuffle" :disabled="progressionType == 'FullyRandom'">Shuffle</button>
      <button v-on:click="enableBiasedShuffle" :disabled="progressionType == 'BiasedRandom'">BiasedShuffle</button>

      <button v-on:click="skipVideo">></button>
    </SideMenu>

    <div class="media-content">
      <div class="media-item">
        <MediaPlayer :videoId="getCurrentMediaUrl" :mediaType="getCurrentMediaType" @onVideoEnd="endVideo" ref="mediaPlayer"/>
      </div>
      <div class="media-item">
        <MediaIcon v-on:toggle="pauseVideo" :mediaState="playerState" :mediaUrl="getCurrentMediaThumbnail"/>
      </div>
      <div class="media-item">
        <MediaDescription :media="currentMedia"/>
      </div>
      <div class="media-item gutter"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import MediaPlayer from '../components/MediaPlayer.vue';
import Header from '../components/HeaderBar.vue';
import JoinPrompt from '../components/JoinPrompt.vue';
import QueueElement from '../components/QueueElement.vue';
import SideMenu from '../components/SideMenu.vue';
import MediaDescription from '../components/MediaDescription.vue';
import MediaIcon from '../components/MediaIcon.vue';
import SearchBar from '../components/SearchBar.vue';

export default {
  components: { MediaPlayer },
  name: 'ROOM',
  components: {
    MediaPlayer,
    Header,
    JoinPrompt,
    QueueElement,
    SideMenu,
    MediaDescription,
    MediaIcon,
    SearchBar
  },
  data: function() {
    return {
      connection: null,
      username: "",
      roomId: "",
      clients: [],
      queueContent: [],
      currentMedia: null,
      playerState: false,
      progressionType: "Linear",
      isLooping: false,
      minimizedSidebar: false,
    }
  },
  methods: {
    createRoom: function(event) {
      console.log(this.connection.readyState);
        this.connection.send('PAUSE!!!');
    },
    pauseVideo : async function() {
      console.log("PAUSING THE VIDEO");
      this.connection.send(JSON.stringify({
            actionType: 'ToggleVideo',
            state: this.playerState,
      }));
    },
    toggleVideoState: async function (mediaState) {
      await this.$refs.mediaPlayer.toggleMediaState(mediaState)
    },
    getVideoTime: async function () {
      let time = await this.$refs.mediaPlayer.getMediaTime();
      this.connection.send(JSON.stringify({ actionType: 'SyncVideo', time: time }));
    },
    joinRoom: async function (name) {
      let id = this.roomId;
      let username = name;
      console.log(id);
      axios
          .post('http://localhost:8080/joinRoom', { roomId: id, username: username }, 
          { 
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
            crossDomain: true,
          })
          .then(async response => {
            let data = response.data;
            this.queueContent = data.queue;

            await this.buildWebSocketConnection();

            // sync the video using aggregate sync
            axios.post('http://localhost:8080/trySync', { roomId: id, username: username },
            { 
              headers: {
                'Content-Type': 'application/json',
              },
              crossDomain: true,
            });
      });
    },
    addVideo: function (url) {
      console.log("ADDING A VIDEO!");
      this.connection.send(JSON.stringify({
            actionType: 'PlayYoutubeVideo',
            url: url
      }));
    },
    playVideoById: function (id) {
      this.connection.send(JSON.stringify({
          actionType: 'PlayYoutubeVideoById',
          id: id
      }));
    },
    //TODO: reimplement media type when ready
    addVideoToQueueById: function(id) {
      this.connection.send(JSON.stringify({
        actionType: 'AddSongToQueueById',
        id: id,
      }));
    },
    addVideoToQueue: function(url) {
      this.connection.send(JSON.stringify({
        actionType: 'AddSongToQueue',
        url: url
      }));
    },
    setVideoTime: async function (time) {
      await this.$refs.mediaPlayer.setMediaTime(time);
    },
    setVideoTimeDev: async function () {
      await this.$refs.mediaPlayer.setMediaTime(30);
    },
    buildWebSocketConnection: async function () {
      let conn = new WebSocket('ws://localhost:8080');
      let vm = this;

      this.connection = conn;

      this.connection.onopen = function open() {
        // Send the user back to the webserver
        conn.send({ username: vm.username });
        console.log(`Opening connection: ${vm.username}`);
        if (vm.clients.length == 0 || vm.clients === undefined) {
          // Add the newly connected client to the list of clients
          console.log(`Added new user ${vm.username}`);
          vm.clients.push(vm.username);
        }
      };

      this.connection.onmessage = async function message(message) {

        //TODO: Convert this into an event emitter instead of having a ton of if statements
        // I'd rather have a bunch of .on(actionType, function) than 100 if statements lol
        // Refactor after alpha release
        console.log('Recieved a message from Websocket Server:');
        let data;
        try {
          data = JSON.parse(message.data);
          console.log(data);
          if (data.actionType) {
            if (data.actionType == 'roomConnect') {
              // add the last added client to the list of added clients
              vm.clients.push(data.clients.pop());
              return;
            }
            if (data.actionType === 'PlayYoutubeVideo') {
              vm.$refs.mediaPlayer.setMedia();
              vm.currentMedia = data.media;
              return;
            }
            if (data.actionType === 'ToggleVideo') {
              vm.toggleVideoState(data.state);
              this.playerState = data.state;
              return;
            }
            if (data.actionType === 'GetVideoTime') {
              vm.getVideoTime();
            }
            if (data.actionType === 'VideoSync') {
              vm.$refs.mediaPlayer.setMedia();
              vm.currentMedia = data.media;
              // this is honestly the lamest shit i have ever had to work around in my entire life
              // Note: This is a hack, until I decouple the video player, this is gonna stay
              setTimeout(() => vm.$refs.mediaPlayer.setMediaTime(data.time), 1000);    
            }
            if (data.actionType === 'UpdateQueue') {
              vm.queueContent.push(data.media);
            }
            if (data.actionType === 'ModifyRoomSettings') {
              vm.isLooping = data.options.isLooping;
              vm.progressionType = data.options.progressionType;
            }
          }
        } catch (err) {
          console.log(`Error parsing websocket messageevent: ${err}`);
        }
      };
    },
    skipVideo () {
        this.connection.send(JSON.stringify({
          actionType: 'EndVideo'
        }));
    },
    endVideo() {
      this.connection.send(JSON.stringify({
        actionType: 'EndVideo'
      }));
    },
    enableShuffle () {
      this.progressionType = 'FullyRandom';
      this.connection.send(JSON.stringify({
        actionType: 'ModifyRoomSettings',
        options: {
          isLooping: this.isLooping,
          progressionType: this.progressionType
        }
      }));
    },
    enableBiasedShuffle () {
      this.progressionType = 'BiasedRandom';
      this.connection.send(JSON.stringify({
        actionType: 'ModifyRoomSettings',
        options: {
          isLooping: this.isLooping,
          progressionType: this.progressionType
        }
      }));
    },
    toggleLooping () {
      //this.isLooping != this.isLooping;
      this.connection.send(JSON.stringify({
        actionType: 'ModifyRoomSettings',
        options: {
          isLooping: this.isLooping,
          progressionType: this.progressionType
        }
      }));
    }
  },
  mounted () {
    this.roomId = this.$route.params.roomId;
  },
  computed: {
    getCurrentMediaUrl() {
      if(!this.currentMedia) {
        return "";
      }
      return this.currentMedia.url;
    },
    getCurrentMediaThumbnail() {
      if(!this.currentMedia) {
        return "";
      }
      return this.currentMedia.thumbnailUrl;
    },
    getCurrentMediaType() {
      if(!this.currentMedia) {
        return "";
      }
      return this.currentMedia.mediaType;
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  background-color: rgb(34, 40, 49);
}

.media-content {
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  padding-top: 20vh;
}

.media-item {
  padding-right: 50px;
  &.gutter {
    width: 15%;
  }
}

</style>>