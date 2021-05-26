import VueI18n from 'vue-i18n'

export interface IOptionField {
  name: VueI18n.TranslateResult
  enabled: boolean
  fieldAttributes: any
  icon: string
  recordDataFields?: any
  svg?: boolean
  valueField?: any
}
