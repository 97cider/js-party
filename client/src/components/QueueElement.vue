<template>
  <div>
    <div class="queue-element">
      <img class="queue-thumbnail" :src="thumbnail">
      <div class="queue-songname">
        {{songName}}
      </div>
      <div class="gutter"></div>
      <img class="queue-icon" @click="primaryAction" src="public/svgs/icon-mini-play.svg">
      <img class="queue-icon" @click="secondaryAction" src="public/svgs/icon-mini-add.svg">
    </div>
  </div>
</template>

<script>
export default {
  name: 'QueueElement',
  data: function() {
    return {
      isMinimized: false,
      username: "",
    }
  },
  props: {
      songName: '',
      url: '',
      thumbnail: '',
      id: ''
  },
  methods: {
    primaryAction: function() {
      this.$emit('primaryAction', this.id);
    },
    secondaryAction: function() {
      this.$emit('secondaryAction', this.id);
    }
  },
}
</script>

<style lang="scss" scoped>
  .queue-element
  {
    display: flex;
    padding: 10px;

    border-width: 0px 0px 2px 0px;
    border-color: rgb(113, 128, 143);
    border-style: solid;

    align-items: center;
  }

  .queue-icon {
    width: 20px;
    height: 20px;
    padding-left: 10px;
  }

  .queue-thumbnail
  {
    object-fit: none;
    height: 50px;
    width: 50px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.33);
    border-radius: 3px;
  }
  .queue-songname {
    display: flex;
    justify-content: center;
    flex-direction: column;
    flex-shrink: 0.35;
    padding-left: 10px;
  }
</style>