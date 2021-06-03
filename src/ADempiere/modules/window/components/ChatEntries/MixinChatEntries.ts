import { Namespaces } from '@/ADempiere/shared/utils/types'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IChatEntryData } from '../../WindowType'
import InputChat from './InputChat'

@Component({
  name: 'MixinChatEntries',
  components: {
    InputChat
  }
})
export default class MixinChatEntries extends Vue {
  @Prop({
    type: String,
    default: undefined
  })
  tableName?: string

  @Prop({
    type: Number,
    default: undefined
  })
  recordId?: number

  @Prop({
    type: Boolean,
    default: false
  })
  rightPanel!: boolean

  // Computed properties
  get chatList(): IChatEntryData[] {
    const commentLogs: IChatEntryData[] = this.$store.getters[Namespaces.ChatEntries + '/' + 'getChatEntries']
    if (isEmptyValue(commentLogs)) {
      return []
    }
    commentLogs.sort((a, b) => {
      const c: number = new Date(a.logDate).getMilliseconds()
      const d: number = new Date(b.logDate).getMilliseconds()
      return c - d
    })
    return commentLogs
  }

  get chatListMobile(): IChatEntryData[] {
    const commentLogs: IChatEntryData[] = this.$store.getters[Namespaces.ChatEntries + '/' + 'getChatEntries']
    if (isEmptyValue(commentLogs)) {
      return []
    }
    commentLogs.sort((a, b) => {
      const c = new Date(a.logDate).getMilliseconds()
      const d = new Date(b.logDate).getMilliseconds()
      return c - d
    })
    return commentLogs
  }

  get language() {
    return this.$store.getters.language
  }

  get tableNameToSend(): string | undefined {
    if (isEmptyValue(this.tableName)) {
      this.$route.params.tableName as string
    }
    return this.tableName
  }

  get recordIdToSend() {
    if (isEmptyValue(this.recordId)) {
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

  // Methods

  sendComment() {
    // const comment = this.$store.getters[Namespaces.ChatEntries]
    const comment: string = this.$store.getters[Namespaces.ChatEntries + '/' + 'getChatTextLong']

    if (!isEmptyValue(comment)) {
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
