import Template from './template.vue'
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import MixinField from '../Mixin/MixinField'
import MixinFieldText from '../Mixin/MixinFieldText'
import { getLanguage } from '@/utils/cookies'
import Editor, { EditorOptions } from '@toast-ui/editor'
@Component({
  name: 'FieldTextLong',
  mixins: [Template, MixinField, MixinFieldText]
})
export default class FieldTextLong extends Mixins(MixinField, MixinFieldText) {
    @Prop({ type: String, required: true }) id: string = 'markdown-editor-' + +new Date() + ((Math.random() * 1000).toFixed(0))
    public mode = 'markdown' // 'markdown' or 'wysiwyg'
    public height = '200px'
    public editor: Editor | null = null

    // Computed properties
    get cssClassStyle(): string {
      let styleClass = ' custom-field-text-long '
      if (this.isDisabled) {
        styleClass += ' custom-field-text-long-disable '
      }
      if (this.metadata.cssClassName) {
        styleClass += this.metadata.cssClassName
      }
      return styleClass
    }

    get language(): string {
      // https://github.com/nhnent/tui.editor/tree/master/src/js/langs
      if (!getLanguage()) {
        return 'en_US'
      }
      return getLanguage()!
    }

    get editorOptions(): Partial<EditorOptions> {
      const options: Partial<EditorOptions> = {
        previewStyle: 'vertical',
        useCommandShortcut: true,
        usageStatistics: false, // send hostname to google analytics
        hideModeSwitch: this.isDisabled
      }
      options.initialEditType = this.mode
      options.height = this.height
      options.language = this.language
      return <EditorOptions>options
    }

      // Watchers
      @Watch('value')
    handleValueChange(newValue: any, oldValue: any) {
      if (this.isDisabled) {
        // not changed value
        this.value = oldValue
            // this.editor.setValue(oldValue)
            this.editor!.getCurrentModeEditor().setValue(oldValue)
      } else {
            // this.editor.setValue(newValue)
            this.editor!.getCurrentModeEditor().setValue(newValue)
      }
    }

      @Watch('language')
      handleLanguageChange(langValue: any) {
        this.destroyEditor()
        this.initEditor()
      }

      @Watch('height')
      hanldeHeightChange(heightValue: string) {
        this.editor!.height(heightValue)
      }

      @Watch('isDisabled')
      hanldeIsDisabledChange(value: boolean) {
        // this.classDisabled
        this.destroyEditor()
        this.initEditor()
      }

      // Methods
      initEditor() {
        const initOpts: EditorOptions = <EditorOptions>{
          ...this.editorOptions,
          el: document.getElementById(this.id)
        }

        this.editor = new Editor(initOpts)
        if (this.value) {
          this.editor.getCurrentModeEditor().setValue(this.value)
          // this.editor.setValue(this.value)
        }
        this.setEvents()
      }

      setEvents() {
        if (this.isDisabled) {
          this.removeEventSendValues()
          this.addReanOnlyChanges()
        } else {
          this.addEventSendValues()
          this.removeReadOnlyChanges()
        }
      }

      addEventSendValues(): void {
        // with change event send multiple request to server
        this.editor!.on('blur', () => {
          if (!this.isDisabled) {
            this.preHandleChange(this.editor!.getValue())
          }
        })
      }

      addReanOnlyChanges(): void {
        this.editor!.on('change', () => {
          this.editor!.getCurrentModeEditor().setValue(this.value)
        })
      }

      removeEventSendValues(): void {
        this.editor!.off('blur')
      }

      removeReadOnlyChanges(): void {
        this.editor!.off('change')
      }

      destroyEditor(): void {
        if (!this.editor) {
          return
        }
        this.removeEventSendValues()
        this.removeReadOnlyChanges()
        this.editor.remove()
      }

      setHtml(value: string) {
        this.editor!.setHtml(value)
      }

      getHtml(): string {
        return this.editor!.getHtml()
      }

      // Hooks
      mounted() {
        this.initEditor()
      }

      destroyed() {
        this.destroyEditor()
      }
}
