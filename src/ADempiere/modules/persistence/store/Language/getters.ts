import { RootState } from '@/ADempiere/shared/store/types'
import { GetterTree } from 'vuex'
import { ITranslationData, ITranslationDataExtended, LanguageState } from '@/ADempiere/modules/persistence'
import { IKeyValueObject } from '@/ADempiere/shared/utils/types'
import { IValueData } from '@/ADempiere/modules/core'

type LanguageGetterTree = GetterTree<LanguageState, RootState>

export const getters: LanguageGetterTree = {
  getLanguageByParameter: (state: LanguageState) => (parameter: string): ITranslationDataExtended | undefined => {
    const list: ITranslationDataExtended[] = state.translationsList
    const founded: ITranslationDataExtended | undefined = list.find((language: ITranslationDataExtended) => {
      if (Object.prototype.hasOwnProperty.call(language, parameter)) {
        return language
      }
    })
    return founded
  },
  getTranslationsList: (state: LanguageState): ITranslationDataExtended[] => {
    return state.translationsList
  },
  getTranslationContainer: (state: LanguageState) => (containerUuid: string) : ITranslationDataExtended | undefined => {
    return state.translationsList.find((itemTranslation: ITranslationDataExtended) => itemTranslation.containerUuid === containerUuid)
  },
  getTranslationByLanguage: (state: LanguageState, getters) => (payload: {
        containerUuid: string
        language: string
        recordUuid: string
      }): IKeyValueObject<IValueData>[] => {
    const { containerUuid, language, recordUuid } = payload
    const translationContainer: ITranslationDataExtended = getters.getTranslationContainer(containerUuid)
    if (translationContainer && translationContainer.recordUuid === recordUuid) {
      const translationRecord: ITranslationData | undefined = translationContainer.translations.find((itemTranslation: ITranslationData) => {
        return itemTranslation.language === language
      })
      if (translationRecord) {
        return translationRecord.values
      }
    }
    return [] // {}
  }
}
