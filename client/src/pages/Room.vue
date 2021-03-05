<template>
  <div id="app">
    <Header/>
    Welcome to the new room!
    <input v-model="username" placeholder="UserName">
    <p>Your Username is: {{ username }}</p>
    <button v-on:click="joinRoom">Join Room!</button>
    <button v-on:click="pauseVideo">Pause Video!</button>
    <button v-on:click="setVideoTimeDev">Set Time Test!</button>
    <div>Room ID = {{ $route.params.roomId }}</div>
    <div>
      List of users:
        <li v-for="client in this.clients" :key="client">
          UserName: {{ client }}
        </li>
          <!-- {{ client }}
        </li> -->
    </div>
    <input v-model="urlCandidate" placeholder="URL">
    <button v-on:click="addVideo">Play Video!</button>

    <input v-model="queueCandidate" placeholder="Add Video To Queue">
    <button v-on:click="addVideoToQueue">Add Video To Queue!</button>

    <input type="checkbox" id="checkbox" v-on:change="toggleLooping" v-model="isLooping">
    <label for="checkbox">Loop Playlist: {{ isLooping }}</label>

    <button v-on:click="enableShuffle" :disabled="progressionType == 'FullyRandom'">Shuffle</button>
    <button v-on:click="enableBiasedShuffle" :disabled="progressionType == 'BiasedRandom'">BiasedShuffle</button>

    <button v-on:click="skipVideo">></button>

    <div>
      WOAH THIS IS THE CURRENT VIDEO: {{currentVideo}}
    </div>

    <MediaPlayer :videoId="currentVideo" :mediaType="currentMediaType" @onVideoEnd="endVideo" ref="mediaPlayer"/>
  </div>
</template>

<script>
import axios from 'axios';
import MediaPlayer from '../components/MediaPlayer.vue';
import Header from '../components/HeaderBar.vue';

export default {
  components: { MediaPlayer },
  name: 'ROOM',
  components: {
    MediaPlayer,
    Header,
  },
  data: function() {
    return {
      connection: null,
      username: "",
      roomId: "",
      clients: [],
      urlCandidate: "",
      queueCandidate: "",
      currentVideo: "",
      playerState: false,
      currentMediaType: "youtube",
      progressionType: "Linear",
      isLooping: false
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
    joinRoom: async function () {
      let id = this.roomId;
      let username = this.username;
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
            await this.buildWebSocketConnection();
            axios.post('http://localhost:8080/trySync', { roomId: id, username: username },
            { 
              headers: {
                'Content-Type': 'application/json',
              },
              crossDomain: true,
            });
      });
    },
    addVideo: function () {
      console.log("ADDING A VIDEO!");
      this.connection.send(JSON.stringify({
            actionType: 'PlayYoutubeVideo',
            url: this.urlCandidate
      }));
    },
    addVideoToQueue: function() {
      this.connection.send(JSON.stringify({
        actionType: 'AddSongToQueue',
        url: this.queueCandidate
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
              vm.currentVideo = data.url;
              vm.currentMediaType = data.type;
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
              vm.$refs.mediaPlayer.setMedia(data.url);
              vm.currentVideo = data.url;
              vm.currentMediaType = data.type;
              // this is honestly the lamest shit i have ever had to work around in my entire life
              // Note: This is a hack, until I decouple the video player, this is gonna stay
              setTimeout(() => vm.$refs.mediaPlayer.setMediaTime(data.time), 1000);    
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
  }
}
</script>

<style lang="scss" scoped>
#app {
  background-color: rgb(34, 40, 49);
}
</style>>