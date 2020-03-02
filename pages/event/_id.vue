<template>
  <div>
    <h-header :title="header.title">
      <template slot="actions">
        <h-button variant="outline" @click="goToList">목록으로</h-button>
      </template>
    </h-header>
    <h-space :size="20" />

    <form-container>
      <template #label>제목</template>
      <template #value>
        {{ detail.title }}
      </template>
    </form-container>

    <form-container>
      <template #label>기간</template>
      <template #value>
        {{ formatDate(detail.startTime) }} ~ {{ formatDate(detail.endTime) }}
      </template>
    </form-container>

    <form-container>
      <template #label>생성일</template>
      <template #value>
        {{ formatDate(detail.createTime) }}
      </template>
    </form-container>

    <form-container>
      <template #label>수정일</template>
      <template #value>
        {{ formatDate(detail.updateTime) }}
      </template>
    </form-container>

    <form-container>
      <template #label>짝꿍리스트</template>
      <template #value>
        <span v-if="groups.length">
          <div>총 {{ groups.length }} 짝꿍</div>
          <h-button @click="copyToClipboard">복사하기</h-button>
        </span>
        <h-space :size="5" />
        <div v-for="{ memberList, _id } in groups" :key="_id">
          <h-tag v-for="member in memberList" :key="`${_id}_${member._id}`">
            {{ member.name }}
          </h-tag>
        </div>
      </template>
    </form-container>
  </div>
</template>

<script>
import FormContainer from '@/components/common/FormContainer'
import formatting from '@/mixins/formatting.js'

export default {
  name: 'EventDetail',
  mixins: [formatting],
  components: {
    FormContainer
  },
  data() {
    return {
      header: {
        title: '커피타임 상세'
      },
      detail: {},
      groups: []
    }
  },
  computed: {
    eventId() {
      return this.$route.params.id || 0
    }
  },
  created() {
    if (this.eventId) {
      this.setEventDetail()
      this.setGroupsInEvent()
    }
  },
  methods: {
    async setEventDetail() {
      const { data, status } = await this.$axios.get(`/event/${this.eventId}`)
      if (status !== 200) return

      this.detail = data
    },
    async setGroupsInEvent() {
      const { data, status } = await this.$axios.get(`/group`, {
        params: {
          eventId: this.eventId
        }
      })
      if (status !== 200) return

      this.groups = data
    },
    copyToClipboard() {
      const groupStr = this.groups.reduce((groupStr, group) => {
        const str = group.memberList.map((member) => member.name).join(' & ')
        return groupStr += `${str} \n`
      }, '')
      const el = document.createElement('textarea')
      el.value = groupStr
      el.setAttribute('readonly', '')
      el.style.position = 'absolute'
      el.style.left = '-9999px'
      document.body.appendChild(el)
      
      const selected = document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;      
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el);

      if (selected) {                                 
        document.getSelection().removeAllRanges();    
        document.getSelection().addRange(selected);   
        this.$toast({
          title: '짝꿍 리스트가 복사되었습니다!'
        })
      }
    },
    goToList() {
      this.$router.push('/event')
    }
  }
}
</script>
