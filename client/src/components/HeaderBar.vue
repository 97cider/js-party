<template>
  <div class="header">
    <div class="header-container">
      <transition name="pop-slide">
        <div v-show="!isMinimized" class="header-content">
          <div class="header-item desktop">
            <img class="icon" alt="lt" src="public/svgs/icon-left.svg">
          </div>
          <div class="header-item desktop">
            <img class="logo" alt="lantern-party" src="public/svgs/LaternPartyLogo.svg">
          </div>
          <div class="header-item mobile">
            <img class="logo" alt="lantern-party" src="public/svgs/logo-min.svg">
          </div>
          <div class="header-item desktop">
            <img class="icon-right" alt="lt" src="public/svgs/icon-right.svg">
          </div>
          <div class="header-item alligned">
            <!-- <SearchBar  v-on:playUrl="playUrl"  v-on:addToQueue="addToQueue"/> -->
            <slot></slot>
          </div>
          <!-- Header Gutter -->
          <div class="header-item-right"></div>
          <div class="header-item padded">
            <div v-on:click="toggleSideMenu">
              <img class="button-icon hoverable" alt="^" src="public/svgs/icon-settings.svg">
            </div>
          </div>
          <div class="header-item padded desktop">
            <FullScreenButton/>
          </div>
          <div class="header-item padded desktop">
            <div v-on:click="hideHeaderBar">
              <img class="button-icon hoverable" alt="^" src="public/svgs/expand-icon.svg">
            </div>
          </div>
        </div>
      </transition>
    </div>
    <transition name="pop-slide">
      <div v-show="isMinimized && !isIdle" v-on:mouseover="stopIdle" v-on:mouseleave="allowIdle" class="minimized-header">
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
import FullScreenButton from './FullScreenButton.vue';

export default {
  name: 'Header',
  components: {
    FullScreenButton,
  },
  data: function() {
    return {
      isMinimized: false,
      currentIdleTime: 0,
      canBeIdle: false,
      isIdle: false,
      isFullScreen: false,
    }
  },
  methods: {
    hideHeaderBar: function () {
      this.isMinimized = true;
      this.closeSideMenu();
      this.refreshIdleTimer();
    },
    showHeaderBar: function () {
      this.isMinimized = false;
      this.refreshIdleTimer();
    },
    refreshIdleTimer: function () {
      this.currentIdleTime = 0;
      this.isIdle = false;
      document.documentElement.style.cursor = 'auto';
    },
    allowIdle: function () {
      this.canBeIdle = true;
    },
    stopIdle: function () {
      this.canBeIdle = false;
    },
    icrementIdleTimer: function () {
      this.currentIdleTime += 1;
      if (this.currentIdleTime > 10 && this.canBeIdle) {
        this.isIdle = true;
        if (this.isMinimized === true) {
          document.documentElement.style.cursor = 'none';
        }
      }
    },
    updateIdleTime: function () {
      let vm = this;
      setInterval(() => {
        vm.icrementIdleTimer();
      }, 100)
    },
    toggleSideMenu: function () {
      this.$emit('toggleSideMenu');
    },
    closeSideMenu: function () {
      this.$emit('closeSideMenu');
    },
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
      user-select: none;
      -moz-user-select: -moz-none;
      -khtml-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;

      display: flex;
      align-items: center;

      &.alligned {
        display: flex;
        align-items: center;
        width: 30%;
      }
      &.desktop {
        display: inherit;
      }
      &.mobile {
        display: none;
      }
      &.padded {
        margin-right: 20px;
      }
    }

    .header-item-right {
      margin-left: auto;
      margin-right: 20px;
      margin-top: 15px;

      user-select: none;
      -moz-user-select: -moz-none;
      -khtml-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
    }

    .header-item-top-right {
      margin-left: auto;
      margin-right: 20px;
      margin-top: 0px;

      user-select: none;
      -moz-user-select: -moz-none;
      -khtml-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
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
        &.mobile {
          padding-left: 10px;
          padding-right: 10px;
        }
    }

    .icon {
      height: 60px;
      width: 60px;
    }

    .icon-right {
      height: 60px;
      width: 180px;
    }

    @media only screen and (max-width: 930px) {
      .header-item {
        &.desktop {
          display: none;
        }
        &.mobile {
          display: inherit;
          padding-left: 10px;
          padding-right: 10px;
        }
      }
    }
</style>