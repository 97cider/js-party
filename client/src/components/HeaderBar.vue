<template>
  <div class="header">
    <div class="header-container">
      <div v-show="!isMinimized" class="header-content">
        <div class="header-item">
          <img class="icon" alt="lt" src="public/svgs/icon-left.svg">
        </div>
        <div class="header-item">
          <img class="logo" alt="lantern-party" src="public/svgs/LaternPartyLogo.svg">
        </div>
        <div class="header-item-right">
          <button v-on:click="hideHeaderBar">V</button>
        </div>
      </div>
    </div>
    <div v-show="isMinimized" class="minimized-header">
       <div class="header-item-top-right">
        <button v-on:click="showHeaderBar"> ^ </button>
       </div>
    </div>
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
        background: url(../../public/svgs/header-bg.svg);
        background-repeat: repeat;
        width: 100vw;
        box-shadow: inset 0 -2px 5px rgba(0,0,0,.33);
    }

    .header-item-right {
      margin-left: auto;
      margin-right: 20px;
      margin-top: 20px;
    }

    .header-item-top-right {
      margin-left: auto;
      margin-right: 20px;
      margin-top: 0px;
    }

    .header-content {
        display: flex;
    }

    .minimized-header {
      display: flex;
      height: 63.5px;
    }

    .logo {
        height: 35px;
	      margin: 15px 0px 0px 0px;
    }

    .icon {
      height: 60px;
      width: 60px;
    }
</style>