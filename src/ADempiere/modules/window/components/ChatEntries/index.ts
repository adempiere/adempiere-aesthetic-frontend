import { Component, Prop, Vue } from 'vue-property-decorator'
import Template from './template.vue'
import InputChat from './InputChat'
import { IChatEntryData } from '../../WindowType/DomainType'
import { PropValidator } from 'vue/types/options'
import { Namespaces } from '@/ADempiere/shared/utils/types'

@Component({
  name: 'ChatEntries',
  components: {
    InputChat
  },
  mixins: [Template]
})
export default class ChatEntries extends Vue {
  @Prop() private tableName!: PropValidator<string>
  @Prop() private recordId!: PropValidator<number>
  private language!: string

  // Computed properties
  get chatList() {
    const commentLogs: IChatEntryData[] = this.$store.getters[Namespaces.ChatEntries + '/' + 'getChatEntries']
    if (!commentLogs) {
      return commentLogs
    }
    commentLogs.sort((a, b) => {
      const c: number = new Date(a.logDate).getMilliseconds()
      const d: number = new Date(b.logDate).getMilliseconds()
      return c - d
    })
    return commentLogs
  }

  // get language(){
  //   return this.$store.getters
  // }

  get tableNameToSend(): string | undefined {
    if (!this.tableName) {
      return this.tableName
    }
  }

  get recordIdToSend(): number | undefined {
    if (!this.recordId) {
      return Number(this.$route.params.recordId)
    }
    return Number(this.recordId)
  }

  get isNote(): boolean {
    return this.$store.getters[Namespaces.ChatEntries + '/' + 'getIsNote']
  }

  get getHeightPanelBottom(): number {
    return this.$store.getters[Namespaces.Utils + '/' + 'getSplitHeight'] - 14
  }

  sendComment() {
    // const comment = this.$store.getters[Namespaces.ChatEntries]
    const comment: string = this.$store.getters[Namespaces.ChatEntries + '/' + 'getChatTextLong']

    if (!comment) {
      this.$store.dispatch('createChatEntry', {
        tableName: this.tableNameToSend,
        recordId: this.recordIdToSend,
        comment
      })
    }
  }

  translateDate(value: string | number | Date) {
    return this.$d(new Date(value), 'long', this.language)
  }
}
