import { MutationTree } from 'vuex'
import { ITranslationDataExtended, LanguageState } from '@/ADempiere/modules/persistence'
import { IValueData } from '@/ADempiere/modules/core'
import { ITranslationData } from '../../PersistenceType'
import { IKeyValueObject } from '@/ADempiere/shared/utils/types'

type LanguageMutationTree = MutationTree<LanguageState>

export const mutations: LanguageMutationTree = {
  addTranslationToList(state: LanguageState, payload: ITranslationDataExtended) {
    state.translationsList.push(payload)
  },
  addTranslationToRecord(state: LanguageState, payload: {
    translations: ITranslationDataExtended[]
    translationToAdd: ITranslationDataExtended
  }) {
    payload.translations.push(payload.translationToAdd)
  },
  setTranslationToRecord(state: LanguageState, payload: {
    currentTranslation: ITranslationData
    newValues: IKeyValueObject<IValueData>[]
  }) {
    payload.currentTranslation.values = payload.newValues
  },
  addTranslationChangeRecord(state: LanguageState, payload: {
    currentTranslation: ITranslationData
    newTranslation: ITranslationData
  }) {
    payload.currentTranslation = payload.newTranslation
  },
  resetStateTranslations(state: LanguageState) {
    state.translationsList = []
    state.currentLanguage = {
      containerUuid: '',
      recordId: 0,
      recordUuid: '',
      tableName: '',
      translations: []
    }
  }
}
