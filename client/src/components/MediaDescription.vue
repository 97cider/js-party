<template>
  <div class="media-description">
    <div class="description-item">
      <span class="song-descriptors">You are listening to</span>
    </div>
    <div class="description-item">
      <div class="song-name">
          <span class="song-header"> 
            <div class="song-name-bbox">
              {{getSongName}}
            </div>
          </span>
      </div>
    </div>
    <div class="description-item">
      <span class="song-descriptors">by</span> 
    </div>
    <div class="description-item">
      <span class="song-artist">{{getSongArtist}}</span>
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
  .media-description {
    
    color: white;
    
    font-family: roc-grotesk, sans-serif; 
    font-size: 24px;
    padding-bottom: 10px;
  }

  .description-item {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .song-header {
    font-size: 48px;
    font-weight: 900;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
    max-width: 35vw;
    display: flex;
  }

  .song-artist {
    font-size: 48px;
    font-weight: 900;
  }

  .song-descriptors {
    font-size: 40px;
  }

  .song-name-bbox {
    border-style: solid;
    border-width: 8px;
    border-color: white;
    padding: 10px;
  }
</style>