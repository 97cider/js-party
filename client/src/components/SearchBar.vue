<template>
  <div class="search-bar">
    <div v-bind:style="{ 'border-radius': !isEmpty ? '8px 0px 0px 8px' : '8px' }" class="search-content">
      <div class="search-item secondary">
          <img class="button-icon" alt="?" src="public/svgs/SearchIcon.svg">
      </div>
      <div class="search-item primary">
          <input v-model="urlCandidate" placeholder="Enter a YouTube or SoundCloud url..." class="search-input">
      </div>
    </div>
    <div class="search-button-group">
      <transition name="slide">
        <div  v-show="!isEmpty" class="search-button-overlay">
          <div v-on:click="playUrl" class="search-button">
            <img class="button-icon inverted" alt=">" src="public/svgs/icon-play.svg">
          </div>
          <div class="search-divider"></div>
          <div v-on:click="addToQueue" class="search-button">
            <img class="button-icon" alt="+" src="public/svgs/icon-add.svg">
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  data: function() {
      return {
          urlCandidate: "",
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
      }
  }
}
</script>

<style lang="scss" scoped>
    .search-bar {
        width: 100%;
        display: flex;
    }

    .search-item {
        padding-left: 10px;

        &.primary {
            width: 100%;
        }

        &.secondary {
            padding-top: 2px;
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
        position: absolute;
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
</style>