<template>
  <div>
    <h-header :title="header.title"></h-header>
    <h-space :size="20" />
    <form-container>
      <template #label>
        제목
      </template>
      <template #value>
        <h-input
          v-model="form.title"
          placeholder="제목을 입력하세요."
        ></h-input>
      </template>
    </form-container>

    <form-container>
      <template #label>
        진행 기간
      </template>
      <template #value>
        <input v-model="form.startTime" type="date" placeholder="시작일" /> -
        <input v-model="form.endTime" type="date" placeholder="종료일" />
      </template>
    </form-container>

    <form-container>
      <template #label>
        조건 (최소 몇달 이후)
      </template>
      <template #value>
        <h-search-select
          v-model="selectedMonth"
          :list="months"
          :filter="(obj, input) => obj.includes(input)"
          :item-text="(obj) => obj"
          :item-value="(obj) => obj"
          placeholder="개월 수"
        />
        <div class="helper-text">
          <h-icon name="helper-default"></h-icon>
          짝꿍이 겹치면 안되는 최소한의 기간을 선택합니다. 예를 들어, 최근
          3개월동안 짝꿍이 된 적이 없어야 한다면 3개월을 선택해주시면 됩니다.
        </div>
      </template>
    </form-container>

    <form-container>
      <template #label>참여 명단</template>
      <template #value>
        <h-search-select
          v-if="members.length > 0"
          v-model="selectedMembers"
          :list="members"
          :filter="(obj, input) => obj.name.includes(input)"
          :item-text="(obj) => obj.name"
          :item-value="(obj) => obj._id"
          multiple
        />
        <div>총 {{ selectedMembers.length }}명</div>
      </template>
    </form-container>

    <h-button width="100%" variant="outline" @click="makeRandomGroupList">
      짝꿍 목록 만들기
    </h-button>
    <h-space :size="20" />

    <div>
      <h3>
        짝꿍 목록
        <span v-if="randomGroupList.length > 0">
          (총 {{ randomGroupList.length }} 짝꿍)
        </span>
      </h3>
      <div v-if="!randomGroupList.length">
        [짝꿍 목록 만들기] 버튼을 클릭하면, 짝궁 목록이 만들어 집니다.
      </div>

      <div v-for="group in randomGroupListWithName" :key="group[0]">
        <h-tag v-for="member in group" :key="member">{{ member }}</h-tag>
      </div>
    </div>

    <h-space :size="50" />
    <h-button @click="addEvent">등록하기</h-button>
  </div>
</template>

<script>
import FormContainer from '@/components/common/FormContainer'
import formatting from '@/mixins/formatting.js'

export default {
  name: 'EventCreate',
  components: {
    FormContainer
  },
  mixins: [formatting],
  data() {
    return {
      header: {
        title: '커피 타임 등록하기'
      },
      members: [],
      memberMap: {},
      months: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      selectedMembers: [],
      selectedMonth: 3,
      form: {
        title: '',
        startTime: '',
        endTime: ''
      },
      randomGroupList: [],
      randomGroupListWithName: []
    }
  },
  created() {
    this.getMemberList()
  },
  methods: {
    async getMemberList() {
      const { data, status } = await this.$axios.get('/member')
      if (status === 200) {
        this.members = data
        this.selectedMembers = data
          .filter((item) => item.isActive)
          .map((item) => item._id)

        this.memberMap = this.members.reduce((acc, cur) => {
          const { _id, name } = cur
          return {
            ...acc,
            [_id]: name
          }
        }, {})
      }
    },
    async makeRandomGroupList() {
      if (this.selectedMembers.length < 3) {
        return this.$toast({
          title: '최소한 2명 이상의 멤버를 선택해주세요.',
          theme: 'error'
        })
      }
      if (!this.selectedMonth) {
        return this.$toast({
          title: '기간을 선택해주세요.',
          theme: 'error'
        })
      }
      const today = new Date()
      const createTimeFrom = today.setMonth(
        today.getMonth() - this.selectedMonth
      )
      const createTimeTo = new Date()

      const { data, status } = await this.$axios.post('/randomgroup', {
        memberList: this.selectedMembers,
        createTimeFrom: `${this.formatDate(createTimeFrom)} 00:00:00`,
        createTimeTo: `${this.formatDate(createTimeTo)} 23:59:59`
      })
      if (status === 200 && data.valid) {
        this.randomGroupList = data.groupList
        this.randomGroupListWithName = data.groupList.map((group) =>
          group.map((memberId) => this.memberMap[memberId])
        )
      } else if (status === 200 && !data.valid) {
        this.$toast({
          title: '더 이상의 경우의 수가 없습니다. 기간을 변경해주세요.',
          theme: 'error'
        })
      }
    },
    async addEvent() {
      const { title, startTime, endTime } = this.form
      const payload = {
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime)
      }

      const { data, status } = await this.$axios.post('/event', payload)
      if (status !== 200) return

      const eventId = data._id

      // TODO: Promise.all 사용
      this.randomGroupList.map(async (group) => {
        const payload = {
          memberList: group,
          eventStartTime: new Date(startTime),
          eventId,
        }
        const { data, status } = await this.postGroup(payload)
      })

      // 기존 데이터에 입력했던 모두 리셋 + 성공했다는 메시지 출력
      this.form = {
        title: '',
        startTime: '',
        endTime: ''
      }
      this.randomGroupList = []
      this.randomGroupListWithName = []

      this.$toast({
        title: '새로운 커피타임이 추가되었습니다! :)'
      })

      this.$router.push('/event')
    },
    async postGroup(payload) {
      const result = await this.$axios.post('/group', {
        ...payload
      })
      return result
    }
  }
}
</script>

<style lang="scss">
.helper-text {
  display: flex;
  align-items: center;
}
</style>
