<template>
  <div id="app">
    Welcome to the new room!
    <input v-model="username" placeholder="UserName">
    <p>Your Username is: {{ username }}</p>
    <button v-on:click="joinRoom">Join Room!</button>
    <button v-on:click="pauseVideo">Pause Video!</button>
    <div>Room ID = {{ $route.params.roomId }}</div>
    <div>
      List of users:
        <li v-for="(client, index) in clients" :key="index">
          UserName: {{ client }}
        </li>
          <!-- {{ client }}
        </li> -->
    </div>
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
      clients: [],
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
      let username = this.username;
      console.log(id);
      axios
          .post('http://localhost:8080/joinRoom', { roomId: id, username: username }, 
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

      this.connection.onmessage = function message(message) {
        console.log('Recieved a message from Websocket Server:');
        let data;
        try {
          data = JSON.parse(message.data);
          console.log(data);
          if (data.actionType) {
            if (data.actionType == 'roomConnect') {
              this.clients = data.clients;
              console.log(this.clients);
            }
          }
        } catch (err) {
          console.log(`Error parsing websocket messageevent: ${err}`);
        }
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