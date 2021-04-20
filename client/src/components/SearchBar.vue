<template>
  <div class="search-bar">
    <div v-bind:style="{ 'border-radius': !isEmpty ? '8px 0px 0px 8px' : '8px' }" class="search-content">
      <div class="search-item secondary desktop">
          <img class="button-icon" alt="?" src="public/svgs/SearchIcon.svg">
      </div>
      <div class="search-item primary desktop">
          <input v-model.lazy="urlCandidate" placeholder="Enter a YouTube or SoundCloud url..." class="search-input" @change="searchUrl">
      </div>
      <div class="search-item primary mobile">
          <input v-model.lazy="urlCandidate" placeholder="Enter Url..." class="search-input">
      </div>
      <div v-show="!isEmpty" v-on:click="clearUrlCandidate" v-on:mouseover="clearImageSrc = activeClearImage" v-on:mouseout="clearImageSrc = defaultClearImage" class="search-item secondary clear">
          <img class="button-icon" alt="?" :src="clearImageSrc">
      </div>
    </div>
    <div class="search-button-group">
      <transition name="slide">
        <div  v-show="!isEmpty" class="search-button-overlay">
          <div v-on:click="playUrl" v-on:mouseover="playImageSrc = activePlayImage" v-on:mouseout="playImageSrc = defaultPlayImage" class="search-button">
            <img class="button-icon" alt="+" :src="playImageSrc">
          </div>
          <div class="search-divider"></div>
          <div v-on:click="addToQueue" v-on:mouseover="addImageSrc = activeAddImage" v-on:mouseout="addImageSrc = defaultAddImage" class="search-button">
            <img class="button-icon" alt="+" :src="addImageSrc">
          </div>
        </div>
      </transition>
    </div>
    <div v-show="this.playListItems.length > 0"  class="search-overlay-list">
        <div class="search-overlay">
            <div class="search-overlay-header">Playlist Items:</div>
            <div class="gutter"></div>
            <button>Import Playlist</button>
        </div>
        <li v-for="item in this.playListItems" :key="item">
            <QueueElement :songName="item.title" :id="item.id" :thumbnail="item.thumbnail" v-on:primaryAction="playById" v-on:secondaryAction="addToQueueById"/>
        </li>
    </div>
  </div>
</template>

<script>
import PlayImage from '../../public/svgs/icon-play.svg';
import ActivePlayImage from '../../public/svgs/icon-play-active.svg';

import AddImage from '../../public/svgs/icon-add-def.svg';
import ActiveAddImage from '../../public/svgs/icon-add.svg';

import ClearImage from '../../public/svgs/icon-clear.svg';
import ActiveClearImage from '../../public/svgs/icon-clear-active.svg';

import QueueElement from '../components/QueueElement.vue';

import axios from 'axios';

export default {
  name: 'SearchBar',
  components: {
    QueueElement
  },
  data: function() {
      return {
          urlCandidate: "",
          playImageSrc: PlayImage,
          defaultPlayImage: PlayImage,
          activePlayImage: ActivePlayImage,
          addImageSrc: AddImage,
          defaultAddImage: AddImage,
          activeAddImage: ActiveAddImage,
          clearImageSrc: ClearImage,
          defaultClearImage: ClearImage,
          activeClearImage: ActiveClearImage,
          playListItems: [],
      }
  },
  computed: {
      isEmpty() {
          return this.urlCandidate === "";
      }
  },
  methods: {
      playUrl() {
          this.$emit('playUrl', this.urlCandidate);
      },
      addToQueue() {
        this.$emit('addToQueue', this.urlCandidate);
      },
      addToQueueById(id) {
          this.$emit('addToQueueById', id)
      },
      playById(id) {
          this.$emit('playById', id)
      },
      searchUrl() {
        //this.$emit('searchUrl', this.urlCandidate);
        let vm = this;
        axios
          .get('http://localhost:8080/playlist', { params: { url: this.urlCandidate } }, 
          { 
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
            crossDomain: true,
          })
          .then(async response => {
              vm.playListItems = response.data.items;
          });
      },
      clearUrlCandidate() {
          this.urlCandidate = "";
          this.playListItems = [];
      }
  }
}
</script>

<style lang="scss" scoped>
    .search-bar {
        width: 100%;
        display: flex;
        min-width: 300px;
        position: relative;
    }

    .search-item {
        padding-left: 10px;

        &.primary {
            width: 100%;
        }

        &.secondary {
            padding-top: 2px;
        }

        &.clear {
            padding-right: 10px;
            cursor: pointer;
        }

        &.mobile {
            display: none;
        }
    }

    .search-content {
        display: flex;
        background-color: rgb(34, 40, 49);
        align-items: center;
        border-radius: 8px;
        height: 40px;
        width: 100%;

        transition: border-radius 0.3s;

        border-color: rgb(113, 128, 143);
        border-style: solid;
        border-width: 2px;
    }

    .search-input {
        width: 90%;
        background-color: rgb(34, 40, 49);
        color: rgb(232, 232, 232);
        border-width: 0px;
        font-size: 16px;

        &:focus {
            outline: none;
        }
    }

    .search-button-group {
        width: 103px;
        display: flex;
    }

    .search-button {
        width: 50px;
        color: rgb(232, 232, 232);
        background: rgb(240, 84, 84);

        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:hover {
            background: rgb(190, 106, 116);
        }
    }

    .search-button-overlay {
        display: flex;
        height: 44px;
        transform-origin: 0% 50%;
    }

    .search-add-button {
        width: 50px;
        color: rgb(232, 232, 232);
        background: rgb(240, 84, 84);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .search-divider {
        width: 3px;
        background-color: rgb(48, 71, 94);
    }

    .search-overlay-list
    {
        position: absolute;
        max-height: 70vh;
        overflow-x: hidden;
        overflow-y: scroll;
        background: #30475e;
        color: rgb(232, 232, 232);

        user-select: text;
        z-index: 10000;
        top: 40px;
        border-color: rgb(113, 128, 143);
        border-radius: 0px 0px 10px 10px;
        border-style: solid;
        border-width: 2px;
    }

    .search-overlay {
        display: flex;
        padding-bottom: 10px;
        padding-top: 10px;
        padding-left: 10px;

        border-width: 0px 0px 2px 0px;
        border-color: rgb(78, 90, 102);
        border-style: solid;
    }

    .search-overlay-header {
        display: flex;
        justify-content: center;
        flex-direction: column;
        flex-shrink: 0;
    }

    @media only screen and (max-width: 530px) {
        .search-content {
            width: 40%;
        }
        .search-item {
            padding-left: 10px;

            &.primary {
                width: 100%;
            }

            &.mobile {
                display: initial;
            }

            &.desktop {
                display: none;
            }
        }
    }
</style>