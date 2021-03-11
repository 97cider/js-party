<template>
  <transition name="left-slide">
    <div v-show="!isExpanded" class="side-menu">
        <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SideMenu',
  props: {
    isExpanded: Boolean
  }
}
</script>

<style lang="scss" scoped>
  .side-menu {
    transform-origin: 100% 50%;
    background-color: tomato;
    height: 100vh;
    width: 30%;
    position: absolute;
    right: 0;
  }
    @media only screen and (max-width: 930px) {
      .side-menu {

        width: 100vw;

        &.desktop {
          display: none;
        }
        &.mobile {
          display: inherit;
          padding-left: 10px;
          padding-right: 10px;
        }
      }
    }
</style>