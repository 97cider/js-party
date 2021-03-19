<template>
    <div v-on:click="toggleFullScreen">
        <img v-show="!isMaximized" class="button-icon hoverable" alt="^" src="public/svgs/icon-maximize.svg">
        <img v-show="isMaximized" class="button-icon hoverable" alt="^" src="public/svgs/icon-minimize.svg">
    </div>
</template>

<script>
export default {
  name: 'FullScreenButton',
  data: function() {
    return {
        isMaximized: false,
    }
  },
  methods: {
    toggleFullScreen: function () {
        
        let app = document.getElementById("app");

        if (!this.isMaximized) {
            if (app.requestFullscreen) {
                app.requestFullscreen();
            }
        }
        else {
            if(document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    },
    updateScreenState() {
        let isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
        if (isFullScreen) {
            this.isMaximized = true;
            return;
        }
        this.isMaximized = false;
        return;
    }
  },
  mounted: function () {
    window.addEventListener('fullscreenchange', this.updateScreenState);
    window.addEventListener('webkitfullscreenchange', this.updateScreenState);
    window.addEventListener('msfullscreenchange', this.updateScreenState);
  }
}
</script>

<style lang="scss" scoped>
 
</style>