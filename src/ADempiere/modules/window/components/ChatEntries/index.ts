import { Component, Prop, Vue } from 'vue-property-decorator'
import Template from './template.vue'
import InputChat from './InputChat'
import { IChatEntryData } from '../../WindowType/DomainType'
import { Namespaces } from '@/ADempiere/shared/utils/types'

@Component({
  name: 'ChatEntries',
  components: {
    InputChat
  },
  mixins: [Template]
})
export default class ChatEntries extends Vue {
  @Prop({ default: undefined }) private tableName?: string
  @Prop({ default: undefined }) private recordId?: number
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
      this.$route.params.tableName as string
    }
    return this.tableName
  }

  get recordIdToSend() {
    if (!this.recordId) {
      return this.$route.params.recordId
    }
    return this.recordId
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

    if (comment) {
      this.$store.dispatch(Namespaces.ChatEntries + '/' + 'createChatEntry', {
        tableName: this.tableNameToSend,
        recordId: this.recordIdToSend,
        comment
      })
    }
  }

  translateDate(value: string | number | Date) {
    return this.$d(new Date(value), 'long', this.language)
  }

  clear() {
    this.$store.commit(Namespaces.ChatEntries + '/' + 'setChatText', '')
  }
}
