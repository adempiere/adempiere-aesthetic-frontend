import Template from './template.vue'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { IKeyValueObject, Namespaces } from '@/ADempiere/shared/utils/types'
import { ILanguageData, IValueData } from '@/ADempiere/modules/core'
import { getLocale } from '@/ADempiere/shared/lang/index'

@Component({
  name: 'FieldTranslated',
  mixins: [Template]
})
export default class FieldTranslated extends Vue {
    @Prop({ type: Object, required: true }) fieldAttributes!: any
    @Prop({ type: String, default: undefined }) recordUuid?: string
    public langValue?: string = ''
    public translatedValue = ''
    public isLoading = false

    // Computed properties

    get languageList(): ILanguageData[] {
      const languagesList: ILanguageData[] = this.$store.getters[Namespaces.System + '/' + 'getLanguagesList']
      return languagesList.filter((itemLanguage: ILanguageData) => {
        return !itemLanguage.isBaseLanguage
      })
    }

    get icon(): string {
      if (this.isLoading) {
        return 'el-icon-loading'
      }
      return 'el-icon-refresh'
    }

    get getterTranslationValues(): IKeyValueObject<IValueData>[] | undefined {
      const values: IKeyValueObject<IValueData>[] = this.$store.getters[Namespaces.Language + '/' + 'getTranslationByLanguage']({
        containerUuid: this.fieldAttributes.containerUuid,
        language: this.langValue,
        recordUuid: this.recordUuid
      })
      if (!values) {
        return undefined
      }
      return values
    }

    get gettterValue(): IKeyValueObject<IValueData> | undefined {
      const values: IKeyValueObject<IValueData>[] | undefined = this.getterTranslationValues
      if (!values) {
        return undefined
      }
      return values[this.fieldAttributes.columnName]
    }

    // Watchers
    @Watch('getterValue')
    hanldeGetterValueChange(newValue: string) {
      this.translatedValue = newValue
    }

    // Methods
    getTranslationsFromServer(): void {
      this.isLoading = true
      this.$store.dispatch(Namespaces.Language + '/' + 'getTranslationsFromServer', {
        containerUuid: this.fieldAttributes.containerUuid,
        recordUuid: this.recordUuid,
        tableName: this.fieldAttributes.tableName,
        language: this.langValue
      })
        .finally(() => {
          this.isLoading = false
        })
    }

    getTranslation(): void {
      if (!this.getterTranslationValues) {
        this.getTranslationsFromServer()
      }
    }

    changeTranslationValue(value: IValueData) {
      this.$store.dispatch(Namespaces.Language + '/' + 'changeTranslationValue', {
        containerUuid: this.fieldAttributes.containerUuid,
        language: this.langValue,
        columnName: this.fieldAttributes.columnName,
        value
      })
    }

    // Hooks
    created() {
      console.log(this.languageList)
      console.log(getLocale())
      this.$store.dispatch(Namespaces.System + '/' + 'getLanguagesFromServer')
      const langMatch: ILanguageData | undefined = this.languageList.find((itemLanguage: ILanguageData) => {
        return itemLanguage.languageISO === getLocale()
      })
      console.log('langmatch' + langMatch)
      console.log(this.languageList)
      let langMatchName: string
      if (langMatch) {
        langMatchName = langMatch.language
      } else {
        langMatchName = this.languageList[0].language
      }
      this.langValue = langMatchName
    }
}
