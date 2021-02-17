import Vue from 'vue';
import VueRouter from 'vue-router';
import VueYoutube from 'vue-youtube';

import Intro from './pages/Intro.vue';
import Room from './pages/Room.vue';

import App from './App.vue';

import './scss/style.scss';

Vue.use(VueRouter);
Vue.use(VueYoutube);

Vue.config.productionTip = false;

const routes = [
  { path: '/', component: Intro },
  { name: 'room', path: '/rooms/:roomId', component: Room }
];

const router = new VueRouter({
  hash: true,
  routes: routes,
});

new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
});

window.addEventListener('popstate', () => {
  app.currentRoute = window.location.pathname
});
