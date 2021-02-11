<template>
  <div id="app">
    poggers
    <button v-on:click="createRoom">Create Room</button>
  </div>
</template>

<script>
// import axios from 'axios';

export default {
  name: 'Intro',
  data: function() {
    return {
      connection: null
    }
  },
  methods: {
    createRoom: function(event) {
      console.log(this.connection.readyState)
        //  axios
        //   .get('http://localhost:8080/create-room', { crossdomain: true })
        //   .then(response => (alert(response.data)))
        this.connection.send('PAUSE!!!');
    }
  },
  mounted () {
    // axios
    //   .get('http://localhost:8080/test', { crossdomain: true })
    //   .then(response => (alert(response.data)))

    let conn = new WebSocket('ws://localhost:8080');

    this.connection = conn;

    this.connection.onopen = function open() {
      conn.send('HOLY SHIIITTTT');
      alert("CONNECTION SETUP!");
    };

    this.connection.onmessage = function message(data) {
      alert(`message got: ${data}`);
    };
    
  }
}
</script>

<style lang="scss">
#app {
  background-color: tomato;
}
</style>