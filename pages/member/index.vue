<template>
  <div class="member-list">
    <h-header
      title="힐페 멤버 목록"
      description="커피타임에 참여하는 멤버를 관리합니다."
    />

    <h-space :size="20" />

    <div class="member-add">
      <div class="form-container">
        <div class="form-input">
          <h-input v-model="name" placeholder="멤버의 이름을 입력하세요." />
        </div>
        <div class="form-button">
          <h-button @click="handleClick">새로 등록</h-button>
        </div>
      </div>
    </div>

    <h-space :size="20" />

    <table>
      <thead>
        <tr>
          <th>이름</th>
          <th>등록일</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ name, createTime, isActive, _id } in members" :key="name">
          <td>{{ name }}</td>
          <td>{{ formatDate(createTime) }}</td>
          <td>
            <div class="toggle-wrap">
              <h-toggle
                :checked="isActive"
                @change="toggleActive(_id, isActive)"
              />
              <h-button
                variant="text"
                small
                color="red"
                @click="deleteMember(_id)"
              >
                <h-icon name="delete-red"></h-icon>
              </h-button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import formatting from '@/mixins/formatting.js'

export default {
  name: 'MemberList',
  mixins: [formatting],
  data() {
    return {
      members: [],
      name: ''
    }
  },
  async created() {
    await this.getMemberList()
  },
  methods: {
    async getMemberList() {
      const { data, status } = await this.$axios.get('/member')
      if (status === 200) {
        this.members = data
      }
    },
    async handleClick() {
      if (!this.name) {
        return this.$toast({
          title: '멤버 이름은 필수값입니다.',
          theme: 'error'
        })
      }

      // 멤버 추가하는 api
      await this.$axios.post('/member', {
        name: this.name,
        isActive: true
      })

      this.name = ''

      // 새로 멤버 리스트를 불러온다.
      this.getMemberList()
    },
    async toggleActive(id, active) {
      const { status } = await this.$axios.patch(`/member/${id}`, {
        isActive: !active
      })
      if (status !== 200) return

      this.getMemberList()
      this.$toast({
        title: '상태가 변경되었습니다.'
      })
    },
    async deleteMember(id) {
      const confirm = await this.$dialog({
        title: '멤버 삭제',
        titleColor: 'error',
        content: '정말 삭제하시겠습니까?',
        actions: [
          {
            title: '확인',
            click: () => true
          },
          {
            title: '취소',
            click: () => false
          }
        ]
      })
      if (!confirm) return

      const { status } = await this.$axios.delete(`/member/${id}`)
      if (status === 200) {
        this.$toast({
          title: '해당 멤버가 삭제되었습니다.'
        })
      }
      this.getMemberList()
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

.member-add {
  padding: 20px;
  margin-bottom: 7px;
  border: 1px solid lightgrey;
  border-radius: 8px;
}
.form-container {
  display: flex;
  align-items: center;
  .form-input {
    flex: 1;
  }
}
.toggle-wrap {
  display: flex;
}
</style>
