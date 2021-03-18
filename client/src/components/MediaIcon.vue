<template>
  <div v-on:mouseover="isHovered = true" v-on:mouseleave="isHovered = false" class="media-thumbnail">
      <div class="media-image">
        <img class="thumbnail" alt="^" :src="getMediaUrl">
        <div class="reflection"></div>
        <div class="reflection-clip">
          <img class="thumbnail inverse" alt="^" :src="getMediaUrl">
        </div>
      </div>
    <div v-show="isHovered" class="thumbnail-overlay">
        <div v-on:click="pauseVideo" class="pause-button">Pause</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaIcon',
  data: function() {
    return {
        isHovered: false,
    }
  },
  props: {
    mediaUrl: '',
    mediaState: Boolean,
  },
  methods: {
      pauseVideo: function () {
        this.$emit('toggle');
      }
  },
  computed: {
      getMediaUrl: function () {
          if (this.mediaUrl) {
              return this.mediaUrl;
          }
          return '';
      }
  }
}
</script>

<style lang="scss" scoped>
 .media-thumbnail {
    width: 400px;
    height: 400px;
    position: relative;
 }

 .thumbnail {
    width: 400px;
    height: 400px;
    object-fit: cover;

    &.inverse {
      transform: scaleY(-1);
    }

    &:hover {
      filter: blur(20px);
    }
 }

 .thumbnail-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
 }

 .pause-button {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: cyan; 
 }

 .reflection {
    width: 400px;
    height: 100px;
    position: absolute;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), #222831);
    z-index: 1;
    object-fit: cover;
    left: 0;
    content: ""
 }

 .reflection-clip {
    height: 100px;
    width: 400px;
    overflow: hidden;
 }
</style>