export default function({ $axios, app }, inject) {
  console.log('#####axios#####')
  $axios.defaults.baseURL = `https://popcorn.test.gnst.me`

  // TODO: 인증키
}
