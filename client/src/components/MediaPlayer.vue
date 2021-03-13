<template>
  <div id="mediaPlayer">
    <div v-show="false">
        <youtube :video-id="youtubeUrl" :player-vars="youtubePlayerOptions" ref="youtube" />
    </div>
    <button v-on:click="getTimeTest">Get SoundCloud Time!</button>
    <div v-show="!isYoutubeVideo">
      <iframe id="soundcloudPlayer" width="100%" height="166" scrolling="no" frameborder="no" :src="soundCloudUrl"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaPlayer',
  props: {
    videoId: '',
    mediaType: '',
  },
  data: function() {
    return {
      youtubePlayerOptions: {
        autoplay: 1
      },
      currentVideo: "",
      soundcloud: null,
    }
  },
  computed: {
    player() {
      return this.$refs.youtube.player;
    },
    soundCloudUrl() {
      if (this.mediaType === 'soundcloud') {
        return `https://w.soundcloud.com/player/?url=${this.videoId}&amp;auto_play=true`;
      }
      return '';
    },
    youtubeUrl() {
      if (this.mediaType === 'youtube') {
        return this.videoId;
      }
      return '';
    },
    isYoutubeVideo() {
      if(this.mediaType === 'youtube') {
        return true;
      }
      return false;
    }
  },
  methods: {
    toggleMediaState: async function (mediaState) {
      if(mediaState) {
        if (this.mediaType === 'soundcloud') {
          this.soundcloud.pause();
          return;
        }
        await this.player.pauseVideo();
        return;
      }
      if (this.mediaType === 'soundcloud') {
        this.soundcloud.play();
        return;
      }
      await this.player.playVideo();
    },
    getSoundCloudTime: async function () {
      return new Promise((resolve, reject) => {
        this.soundcloud.getPosition( (time) => {
          if (!time) {
            return reject('No time found!');
          }
          alert(time);
          resolve(time);
        });
      });
    },
    getTimeTest: function () {
      console.log('GETTING THE CURRENT TIME');
      let time = this.soundcloud.getPosition((time) => {
        console.log('holy fuck can this please emit any events');
      });
      console.log(time);
      // widget.bind(SC.Widget.Events.PLAY_PROGRESS, function () {
      //   console.log('fuckkkk');
      // });
      // widget.pause();
      // widget.bind(SC.Widget.Events.FINISH, function () {
      //   console.log('holy shit please RESET FOR FUCKS SAKE');
      // });
    },
    getMediaTime: async function () {
      let time;
      if (this.mediaType === 'soundcloud') {
        time = await this.getSoundCloudTime();
      }
      else {
        time = await this.player.getCurrentTime();
      }
      return time;
    },
    setMediaTime: async function (time) {
      if (this.mediaType === 'soundcloud') {
        this.soundcloud.seekTo(time * 1000);
        return;
      }
      await this.player.seekTo(time, true);
      return;
    },

    finishSCLoad() {
      alert('PLEASE');
    },

    logSCPlaying() {
      console.log('JESUS');
    },

    bindSoundCloudAPI: function () {
      let vm = this;
      console.log('Soundcloud API has been properly bound.');
      let scFrame = document.getElementById('soundcloudPlayer');
      vm.soundcloud = SC.Widget(scFrame.id);
      vm.soundcloud.bind( SC.Widget.Events.READY, function () {
        vm.logSCPlaying();
      });
      vm.soundcloud.bind( SC.Widget.Events.PLAY_PROGRESS, function () {
        vm.logSCPlaying();
      });
    },

    // DEPRECATED: USE VIDEOID and VIDEOTYPE PROP INSTEAD
    setMedia: function () {
      if (!this.soundcloud) {
        console.log('SETTING UP SOUNDCLOUD WIDGET');
      }
    },
    youtubePlayerStateChange (youtubeState) {
      if (youtubeState.data === 0) {
          this.$emit('onVideoEnd', '') 
      }
    }
  },
  created () {
    
  },
  mounted () {

    // Add Youtube State Change to Detect End of Video
    this.player.addEventListener('onStateChange', this.youtubePlayerStateChange);
    window.addEventListener('message', this.receiveMessage);

    // Add soundcloud widget API script
    let soundCloudWidgetScript = document.createElement('script');
    soundCloudWidgetScript.setAttribute('type', 'text/javascript');
    soundCloudWidgetScript.setAttribute('src', 'https://w.soundcloud.com/player/api.js');
    soundCloudWidgetScript.onload = () => {
      this.bindSoundCloudAPI();
    }
    document.head.appendChild(soundCloudWidgetScript);
  }
}
</script>