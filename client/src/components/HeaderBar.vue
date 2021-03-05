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
          <div class="header-item-right">
            <div v-on:click="hideHeaderBar">
              <img class="button-icon" alt="^" src="public/svgs/expand-icon.svg">
            </div>
          </div>
        </div>
      </transition>
    </div>
    <transition name="pop-slide">
      <div v-show="isMinimized" class="minimized-header">
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
export default {
  name: 'Header',
  data: function() {
    return {
      isMinimized: false,
    }
  },
  methods: {
    hideHeaderBar: function () {
      this.isMinimized = true;
    },
    showHeaderBar: function () {
      this.isMinimized = false;
    }
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