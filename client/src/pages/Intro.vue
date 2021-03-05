<template>
  <div id="app">
    Welcome To .JsParty! A place where you can listen to music with friends. Right now only YouTube is supported, but I am working on adding Soundcloud Support!
    <button v-on:click="createRoom">Create Room</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Intro',
  data: function() {
    return {
      connection: null
    }
  },
  methods: {
    createRoom: function(event) {
         axios
          .post('http://localhost:8080/room', { crossdomain: true })
          .then(response => {
            console.log(`Room ID: ${response.data.message}`);
            this.$router.push({ name: 'room', params: { roomId: response.data.message } })
          });

    }
  },
  mounted () {
    console.log('Welcome to .js-party!!!');
  }
}
</script>

<style lang="scss" scoped>
  #app {
    background-color: tomato;
  }
</style>>