<template>
  <div class="media-description">
    <div class="description-item">
      You are listening to
    </div>
    <div class="description-item">
      {{getSongName}}
    </div>
    <div class="description-item">
      by {{getSongArtist}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaDescription',
  data: function() {
    return {
    }
  },
  props: {
    media: null
  },
  computed: {
    getSongName () {
      if(!this.media) {
        return "";
      }
      return this.media.name;
    },
    getSongArtist () {
      if (!this.media) {
        return "";
      }
      return this.media.artistName;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>