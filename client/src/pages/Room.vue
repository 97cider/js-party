<template>
  <div id="app">
    Welcome to the new room!
    <input v-model="username" placeholder="UserName">
    <p>Your Username is: {{ username }}</p>
    <button v-on:click="joinRoom">Join Room!</button>
    <button v-on:click="pauseVideo">Pause Video!</button>
    <div>Room ID = {{ $route.params.roomId }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ROOM',
  data: function() {
    return {
      connection: null,
      username: "",
      roomId: "",
    }
  },
  methods: {
    createRoom: function(event) {
      console.log(this.connection.readyState);
        this.connection.send('PAUSE!!!');
    },
    pauseVideo : function () {
      console.log(this.connection.readyState);
      this.connection.send('PAUSE!!!');
    },
    joinRoom: function () {
      let id = this.roomId;
      console.log(id);
      axios
          .post('http://localhost:8080/joinRoom', { roomId: id }, 
          { 
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
            crossDomain: true,
          })
          .then(response => {
            this.buildWebSocketConnection();
      });
    },
    buildWebSocketConnection: function () {
      let conn = new WebSocket('ws://localhost:8080');

      this.connection = conn;

      this.connection.onopen = function open() {
        conn.send({ username: this.username });
      };

      this.connection.onmessage = function message(data) {
        console.log(`message got: ${data}`);
      };
    },
  },
  mounted () {
    this.roomId = this.$route.params.roomId;
  }
}
</script>

<style lang="scss" scoped>
#app {
  background-color: tomato;
}
</style>>