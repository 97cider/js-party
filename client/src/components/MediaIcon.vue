<template>
  <div v-on:mouseover="isHovered = true" v-on:mouseleave="isHovered = false" class="media-thumbnail">
      <div class="media-image">
        <img class="thumbnail" alt="^" :src="getMediaUrl">
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
        console.log('what the unironic fuck');
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
 }

 .thumbnail-overlay {
    background: tomato;
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
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: cyan; 
 }
</style>