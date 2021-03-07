<template>
  <div class="header">
    <div class="header-container">
      <transition name="pop-slide">
        <div v-show="!isMinimized" class="header-content">
          <div class="header-item">
            <img class="icon" alt="lt" src="public/svgs/icon-left.svg">
          </div>
          <div class="header-item">
            <img class="logo" alt="lantern-party" src="public/svgs/LaternPartyLogo.svg">
          </div>
          <div class="header-item">
            <img class="icon-right" alt="lt" src="public/svgs/icon-right.svg">
          </div>
          <div class="header-item alligned">
            <SearchBar  v-on:playUrl="playUrl"  v-on:addToQueue="addToQueue"/>
          </div>
          <div class="header-item-right">
            <div v-on:click="hideHeaderBar">
              <img class="button-icon hoverable" alt="^" src="public/svgs/expand-icon.svg">
            </div>
          </div>
        </div>
      </transition>
    </div>
    <transition name="pop-slide">
      <div v-show="isMinimized && !isIdle" class="minimized-header">
        <div class="header-item-top-right">
          <div class="header-expand-content" v-on:click="showHeaderBar">
            <img class="button-icon inverted" alt="^" src="public/svgs/expand-icon.svg">
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import SearchBar from './SearchBar.vue';

export default {
  name: 'Header',
  components: {
    SearchBar
  },
  data: function() {
    return {
      isMinimized: false,
      currentIdleTime: 0,
      isIdle: false,
    }
  },
  methods: {
    hideHeaderBar: function () {
      this.isMinimized = true;
      this.refreshIdleTimer();
    },
    showHeaderBar: function () {
      this.isMinimized = false;
      this.refreshIdleTimer();
    },
    refreshIdleTimer: function () {
      this.currentIdleTime = 0;
      this.isIdle = false;
    },
    icrementIdleTimer: function () {
      this.currentIdleTime += 1;
      if (this.currentIdleTime > 10) {
        this.isIdle = true;
      }
    },
    updateIdleTime: function () {
      let vm = this;
      setInterval(() => {
        vm.icrementIdleTimer();
      }, 100)
    },
    playUrl: function (url) {
      this.$emit('playUrl', url);
    },
    addToQueue: function (url) {
      this.$emit('addToQueue', url);
    }
  },
  mounted: function () {
    window.addEventListener('mousemove',this.refreshIdleTimer);
    this.updateIdleTime();
  }
}
</script>

<style lang="scss" scoped>
    .header-container {
        // background: rgb(48, 71, 94);
        position: relative;
        height: 60px;
        width: 100vw;
    }

    .header-item {
      &.alligned {
        display: flex;
        align-items: center;
        width: 30%;
      }
    }

    .header-item-right {
      margin-left: auto;
      margin-right: 20px;
      margin-top: 15px;
    }

    .header-item-top-right {
      margin-left: auto;
      margin-right: 20px;
      margin-top: 0px;
    }

    .header-content {
        display: flex;
        height: 60px;
        position: absolute;
        width: 100%;
        background: url(../../public/svgs/header-bg.svg);
        background-repeat: repeat;
        box-shadow: inset 0 -2px 5px rgba(0,0,0,.33);
    }

    .header-expand-content {
      background: rgb(240, 84, 84);
      border-radius: 0px 0px 10px 10px;
      padding: 10px 3px 0px 3px;
      cursor: pointer;
       &:hover {
         background: rgb(190, 106, 116);
         box-shadow: inset 0 -2px 5px rgba(0,0,0,.33);
       }
    }

    .minimized-header {
      display: flex;
      position: absolute;
      top: 0;
      width: 100%;
    }

    .logo {
        height: 35px;
	      margin: 15px 0px 0px 0px;
    }

    .icon {
      height: 60px;
      width: 60px;
    }

    .icon-right {
      height: 60px;
      width: 180px;
    }
</style>