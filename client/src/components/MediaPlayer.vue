<template>
  <div id="mediaPlayer">
    <!-- <iframe id="player" width='560' height='315' :src="currentVideo" frameborder='0' allow='autoplay'></iframe> -->
    YOOOO THIS IS A MEDIA COMPONENT
    <youtube :video-id="currentVideo" :player-vars="youtubePlayerOptions" ref="youtube" />
  </div>
</template>

<script>
export default {
  name: 'MediaPlayer',
  data: function() {
    return {
      youtubePlayerOptions: {
        autoplay: 1
      },
      currentVideo: ""
    }
  },
  computed: {
    player() {
      return this.$refs.youtube.player;
    }
  },
  methods: {
    pauseMedia : async function() {
      let playerState = this.player.getPlayerState();
      if (playerState === 2) {
        await this.player.playVideo();  
      }
      else if (playerState === 1) {
        await this.player.pauseVideo();
      }

      this.connection.send(JSON.stringify({
            actionType: 'ToggleVideo',
            state: playerState,
      }));
    },
    toggleMediaState: async function (mediaState) {
      if(mediaState) {
        await this.player.pauseVideo();
        return;
      }
      await this.player.playVideo();
    },
    getMediaTime: async function () {
      let time = await this.player.getCurrentTime();
      return time;
    },
    setMediaTime: async function (time) {
      await this.player.seekTo(time, true);
    },
    setMedia: function (media) {
        console.log(`Playing url ${media} from outside the component`)
        this.currentVideo = media;
        console.log(this.currentVideo);
    },
    youtubePlayerStateChange (youtubeState) {
      if (youtubeState.data === 0) {
          this.$emit('onVideoEnd', '') 
      }
    },
  },
  mounted () {
    this.player.addEventListener('onStateChange', this.youtubePlayerStateChange);
  }
}
</script>