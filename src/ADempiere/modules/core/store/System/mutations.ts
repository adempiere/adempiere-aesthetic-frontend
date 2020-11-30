import {
  SystemState,
  ICountryData,
  ILanguageData
} from '@/ADempiere/modules/core'
import { MutationTree } from 'vuex'
import { ISystemInfoData } from '@/ADempiere/modules/user'
import { convertDateFormat } from '@/ADempiere/shared/utils/valueFormat'

type SystemMutationTree = MutationTree<SystemState>

export const mutations: SystemMutationTree = {
  setSystemDefinition(state: SystemState, payload: ISystemInfoData): void {
    state.systemDefinition = payload
  },
  setCountry(state: SystemState, payload: ICountryData): void {
    state.country = payload
  },
  setLanguagesList: (state: SystemState, payload: ILanguageData[]): void => {
    const languagesList = payload.map(language => {
      return {
        ...language,
        datePattern: convertDateFormat(language.datePattern.toString()),
        timePattern: convertDateFormat(language.timePattern.toString())
      }
    })

    state.languagesList = languagesList
  }
}
