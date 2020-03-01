<template>
  <div>
    <div class="nav-list">
      <router-link class="nav" to="/event">커피타임 관리</router-link>
      <router-link class="nav" to="/member">멤버 관리</router-link>
      <router-link class="nav" to="/group">짝꿍 목록</router-link>
    </div>
    <div class="defalut-layout">
      <nuxt />
    </div>
    <toast-container></toast-container>
    <dialog-container></dialog-container>
  </div>
</template>

<script>
import Vue from 'vue'
import Welchis, { ToastContainer, DialogContainer } from 'welchis'

Vue.use(Welchis)

export default {
  name: 'DefaultLayout',
  components: {
    ToastContainer,
    DialogContainer
  },
  methods: {
    goToLink(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
.defalut-layout {
  padding: 50px;
}
.nav-list {
  padding: 10px 50px;
  .nav {
    font-size: 20px;
    color: #52b6ad;
    text-decoration: none;
    margin-right: 30px;
    &.active,
    &:hover {
      border-bottom: solid 2px #52b6ad;
      // font-weight: 600;
    }
  }
}

html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
