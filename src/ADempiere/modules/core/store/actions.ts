import {
  SystemState,
  ICountryData,
  ILanguageData,
  requestGetCountryDefinition,
  requestLanguagesList,
  ILanguajesListResponse
} from '@/ADempiere/modules/core'
import { RootState } from '@/ADempiere/shared/store/types'
import { ActionContext, ActionTree } from 'vuex'
import { convertDateFormat } from '@/ADempiere/shared/utils/valueFormat'

type SystemActionContext = ActionContext<SystemState, RootState>
type SystemActionTree = ActionTree<SystemState, RootState>

export const actions: SystemActionTree = {
  getCountryFormServer(
    context: SystemActionContext,
    payload: {
            id: number
            uuid: string
        }
  ): Promise<ICountryData> {
    const { id, uuid } = payload
    return new Promise(resolve => {
      requestGetCountryDefinition({
        id,
        uuid
      })
        .then((responseCountry:ICountryData) => {
          context.commit('setCountry', responseCountry)

          resolve(responseCountry)
        })
        .catch(error => {
          console.warn(
                        `Error getting Country Definition: ${error.message}. Code: ${error.code}.`
          )
        })
    })
  },
  getLanguagesFromServer(context: SystemActionContext): Promise<any> {
    return new Promise(resolve => {
      requestLanguagesList({
        pageToken: undefined,
        pageSize: undefined
      })
        .then((languageResponse:ILanguajesListResponse) => {
          const languagesList: ILanguageData[] = languageResponse.list.map((language: ILanguageData) => {
            return {
              ...language,
              datePattern: convertDateFormat(language.datePattern.toString()),
              timePattern: convertDateFormat(language.timePattern.toString())
            }
          })

          context.commit('setLanguagesList', languagesList)
          resolve(languagesList)
        })
        .catch(error => {
          console.warn(`Error getting Languages List: ${error.message}. Code: ${error.code}.`)
        })
    })
  }
}
