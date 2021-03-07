<template>
  <div>
      <div class="header">
          {{songName}}
      </div>
      <div class="content">
          {{url}}
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
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
</style>