<template>
  <div>
    <h-header title="커피 타임 목록" description="커피타임 내역을 관리합니다.">
      <template slot="actions">
        <h-button @click="makeNewEvent">새로운 커피타임 만들기</h-button>
      </template>
    </h-header>

    <h-space :size="20" />

    <table>
      <thead>
        <tr>
          <th>제목</th>
          <th>기간</th>
          <th>참여 인원(명)</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="{ title, startTime, endTime, _id, groups } in events"
          :key="`tr_${_id}`"
          @click="handleClickRow(_id)"
        >
          <td>{{ title }}</td>
          <td>{{ formatDate(startTime) }} ~ {{ formatDate(endTime) }}</td>
          <td>{{ getMemberLength(groups) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import formatting from '@/mixins/formatting.js'

export default {
  name: 'EventList',
  mixins: [formatting],
  data() {
    return {
      events: []
    }
  },
  created() {
    this.getEventList()
  },
  methods: {
    async getEventList() {
      const { data, status } = await this.$axios.get('/event', {
        params: {
          sortBy: 'createTime:desc'
        }
      })
      if (status !== 200) return

      this.events = data
    },
    makeNewEvent() {
      this.$router.push('/event/create')
    },
    handleClickRow(id) {
      this.$router.push(`/event/${id}`)
    },
    getMemberLength(groups) {
      const total = groups.reduce((acc, group) => {
        acc += group.memberList.length
        return acc
      }, 0)
      return total
    }
  }
}
</script>

<style lang="scss" scoped>
table {
  width: 100%;
}
table,
td {
  border: 1px solid #ececec;
}
thead {
  background-color: #ececec;
}
th,
td {
  padding: 10px;
}
tr:hover {
  cursor: pointer;
}
</style>
