import { LanguageState } from '@/ADempiere/modules/persistence'

export const state: LanguageState = {
  translationsList: [],
  currentLanguage: {
    containerUuid: '',
    recordId: 0,
    recordUuid: '',
    tableName: '',
    translations: []
  }
}
