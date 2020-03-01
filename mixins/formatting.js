export default {
  methods: {
    formatDate(time) {
      const d = new Date(time)
      const year = d.getFullYear()
      const month = d.getMonth() + 1
      const date = d.getDate()
      return `${year}.${month}.${date}`
    }
  }
}
