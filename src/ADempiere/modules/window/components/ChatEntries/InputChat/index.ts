import { getLanguage } from '@/utils/cookies'
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import Template from './template.vue'

import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor } from '@toast-ui/vue-editor'
import '@toast-ui/editor/dist/i18n/es-es'
import { Namespaces } from '@/ADempiere/shared/utils/types'

@Component({
  name: 'InputChat',
  components: {
    ToastEditor: Editor
  },
  mixins: [Template]
})
export default class Dashboard extends Vue {
    // Properties
    @Prop() private language!: string
    @Ref() readonly editor!: Editor

    // Computed properties
    get editorInstance(): Editor {
      return this.editor
    }

    get editorOptions() {
      return {
        language: this.language,
        minHeight: '100px',
        usageStatistics: false,
        hideModeSwitch: false
      }
    }

    get getLanguage(): string {
      const langInCookie = getLanguage()
      if (!langInCookie) {
        return 'en-US'
      }
      return langInCookie.replace('_', '-')
    }

    get markdownValue(): string {
      return this.editorInstance.invoke('getMarkdown')
    }

    // Getters & Setters
    get value() {
      return this.$store.getters[Namespaces.ChatEntries + '/' + 'getChatTextLong']
    }

    set value(newValue: string) {
      this.$store.dispatch(Namespaces.ChatEntries + '/' + 'setChatText', newValue)
    }

    // Watchers
    @Watch('value')
    onPropertyChanged(newValue: string) {
      if (!newValue) {
        this.editorInstance.invoke('setMarkdown', '')
      }
    }

    // Methods
    onContentChanged() {
      this.value = this.markdownValue
    }
}
