import { GetterTree } from 'vuex'
import { SystemState } from '@/ADempiere/modules/core'
import { RootState } from '@/ADempiere/shared/store/types'

type SystemGetter = GetterTree<SystemState, RootState>

export const getters: SystemGetter = {
  getCountry: (state: SystemState) => {
    return state.country
  },
  getCurrency: (state: SystemState) => {
    const { currencyIsoCode, standardPrecision } = state.systemDefinition!

    return {
      standardPrecision: standardPrecision || 2,
      iSOCode: currencyIsoCode || 'USD'
    }
  },
  getCountryLanguage: (state: SystemState) => {
    return state.systemDefinition!.language.replace('_', '-')
  },
  getLanguagesList: state => {
    return state.languagesList
  },
  getCurrentLanguageDefinition: (state: SystemState) => {
    let { language } = state.systemDefinition!
    if (language) {
      language = 'en_US'
    }
    return state.languagesList.find(definition => {
      return definition.language === language
    })
  }
}
