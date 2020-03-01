<template>
  <div>
    <h-header :title="header.title" :description="header.desc" />

    <h-space :size="20" />

    <table>
      <thead>
        <tr>
          <th>커피 타임 제목</th>
          <th>멤버</th>
          <th>등록일</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="{ eventId, memberList, createTime, _id } in groupList"
          :key="`${eventId}_${_id}`"
        >
          <td>{{ eventId ? eventId.title : '' }}</td>
          <td>
            <h-tag v-for="member in memberList" :key="`${_id}_${member._id}`">
              {{ member.name }}
            </h-tag>
          </td>
          <td>
            {{ formatDate(createTime) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import formatting from '@/mixins/formatting.js'

export default {
  name: 'GroupList',
  mixins: [formatting],
  data() {
    return {
      header: {
        title: '짝궁 목록',
        desc: '짝꿍 내역을 확인할 수 있습니다.'
      },
      groupList: []
    }
  },
  created() {
    this.setGroupList()
  },
  methods: {
    async setGroupList() {
      const { status, data } = await this.$axios.get('/group')
      if (status !== 200) return

      this.groupList = data
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
</style>
