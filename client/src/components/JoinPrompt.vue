<template>
  <div v-if="!isMinimized">
    <div class="join-prompt">
        <div class="join-content">
          <span class="join-header">Welcome to Lantern Party!</span>
          <span class="join-subheader">Before getting started, enter your display name to join the room</span>
          <input class="join-input" v-model="username" placeholder="UserName">
          <div class="join-button" v-on:click="joinRoom">Join Room!</div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JoinPrompt',
  data: function() {
    return {
      isMinimized: false,
      username: "",
    }
  },
  props: {
  },
  methods: {
    joinRoom() {
        this.$emit('joinRoom', this.username);
        this.isMinimized = true;
    }
  },
}
</script>

<style lang="scss" scoped>
    .join-prompt {
        position:absolute;
        width: 100vw;
        height: 100vh;
        z-index: 99999;
        background: rgba($color: #000000, $alpha: 0.9);

        top: 0;
        left: 0;

        display: flex;
        align-items: center;
    }

    .join-content {
        padding: 20px;
        background-color: rgb(34, 40, 49);
        color: rgb(232, 232, 232);
        margin: auto;
        display: flex;
        flex-direction: column;
        border-radius: 20px;
    }

    .join-header {
        font-family: roc-grotesk, sans-serif; 
        font-size: 24px;
        padding-bottom: 10px;
    }

    .join-subheader {
        font-size: 16px;
        padding-bottom: 10px;
    }

    .join-input {
        background-color: rgb(48, 71, 94);
        color: rgb(232, 232, 232);
        border-color: rgb(113, 128, 143);
        border-style: solid;
        border-width: 2px;
        font-size: 18px;
        margin-top: 10px;
        margin-bottom: 10px;
        border-radius: 10px;

        padding: 10px 10px 10px 10px;

        &:focus {
            outline: none;
        }
    }

    .join-button {
        background: rgb(240, 84, 84);
        text-align: center;
        font-size: 24px;
        padding: 10px;
        border-radius: 10px;
        cursor: pointer;

        &:hover {
            background: rgb(190, 106, 116);
            box-shadow: inset 0 -2px 5px rgba(0,0,0,.33);
        }
    }


</style>