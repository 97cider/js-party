<template>
  <div class="search-bar">
      <div class="search-content">
        <div class="search-item secondary">
            <img class="button-icon" alt="?" src="public/svgs/SearchIcon.svg">
        </div>
        <div class="search-item primary">
            <input placeholder="Enter a YouTube or SoundCloud url..." class="search-input">
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
}
</script>

<style lang="scss" scoped>
    .search-bar {
        width: 100%;
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
</style>