<template>
  <div class="header-container">
    <div class="header-content">
      <img class="icon" alt="lt" src="public/svgs/icon-left.svg">
      <img class="logo" alt="lantern-party" src="public/svgs/LaternPartyLogo.svg">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style lang="scss" scoped>
    .header-container {
        background: rgb(48, 71, 94);
    }

    .header-content {
        display: flex;
        justify-content: cente;
    }

    .logo {
        max-height: 70%;
        max-width: 30%;
        margin: 10px 0px -5px 10px;
    }
</style>