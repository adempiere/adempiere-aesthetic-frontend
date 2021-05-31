import { Namespaces } from '@/ADempiere/shared/utils/types'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { Vue, Component } from 'vue-property-decorator'
import { IChatEntryData } from '../../../WindowType'
import Template from './template.vue'

@Component({
  name: 'ListChatEntry',
  mixins: [Template]
})
export default class ListChatEntry extends Vue {
  // Computed properties
  get chatEntryList() {
    const commentLogs: IChatEntryData[] = this.$store.getters[
      Namespaces.ChatEntries + '/' + 'getChatEntries'
    ]
    if (isEmptyValue(commentLogs)) {
      return []
    }
    // commentLogs.sort((a, b) => {
    //   const c = new Date(a.logDate)
    //   const d = new Date(b.logDate)
    //   return c - d
    // })
    return commentLogs
  }

  get language() {
    return this.$store.getters.language
  }

  // Methods
  translateDate(value: string | number | Date) {
    return this.$d(new Date(value), 'long', this.language)
  }
}
