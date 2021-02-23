<template>
  <div id="mediaPlayer">
    <youtube :video-id="currentVideo" :player-vars="youtubePlayerOptions" ref="youtube" />
    <iframe id="soundcloudPlayer" ref="soundcloud" width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" :src="soundCloudUrl"></iframe>
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
      currentVideo: "900163114",
      soundCloudWidget,
      soundCloudSongUrl: "900163114",
      soundcloud: null,
      message: 'Hello'
    }
  },
  computed: {
    player() {
      return this.$refs.youtube.player;
    },
    soundCloudUrl() {
      return `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${this.videoId}&amp;auto_play=true`;
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

    // DEPRECATED: USE VIDEOID and VIDEOTYPE PROP INSTEAD
    setMedia: function (media) {
        console.log(`Playing url ${media} from outside the component`);
        //this.currentVideo = media;
        let iframe = this.$refs.soundcloud;
        this.soundcloud = SC.Widget(iframe.id);
        // this.soundcloud.load(media, {});
        this.currentVideo = media;
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
    this.player.addEventListener('onStateChange', this.youtubePlayerStateChange);
    let soundCloudWidgetScript = document.createElement('script');
    soundCloudWidgetScript.setAttribute('src', 'https://w.soundcloud.com/player/api.js');
    document.head.appendChild(soundCloudWidgetScript);
  }
}
</script>