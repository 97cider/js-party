<template>
  <div id="app">
    poggers
    <button v-on:click="createRoom">Create Room</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Intro',
  methods: {
    createRoom: function(event) {
         axios
          .get('http://localhost:8080/create-room', { crossdomain: true })
          .then(response => (alert(response.data)))
    }
  },
  mounted () {
    axios
      .get('http://localhost:8080/test', { crossdomain: true })
      .then(response => (alert(response.data)))
  }
}
</script>