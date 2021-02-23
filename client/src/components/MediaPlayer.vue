<template>
  <div id="mediaPlayer">
    <div v-show="!isYoutubeVideo">
      <youtube :video-id="videoId" :player-vars="youtubePlayerOptions" ref="youtube" />
    </div>
    <div v-show="!isYoutubeVideo">
      <iframe id="soundcloudPlayer" ref="soundcloud" width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" :src="soundCloudUrl"></iframe>
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
      return `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${this.videoId}&amp;auto_play=true`;
    },
    isYoutubeVideo() {
      return true;
    }
  },
  methods: {
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

    // DEPRECATED: USE VIDEOID and VIDEOTYPE PROP INSTEAD
    setMedia: function () {
      if (!this.soundcloud) {
        let iframe = this.$refs.soundcloud;
        this.soundcloud = SC.Widget(iframe.id);
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

    // Add soundcloud widget API script
    let soundCloudWidgetScript = document.createElement('script');
    soundCloudWidgetScript.setAttribute('src', 'https://w.soundcloud.com/player/api.js');
    document.head.appendChild(soundCloudWidgetScript);
  }
}
</script>