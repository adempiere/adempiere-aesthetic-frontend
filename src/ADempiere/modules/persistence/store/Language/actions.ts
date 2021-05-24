import { IRootState } from '@/store'
import { ActionTree, ActionContext } from 'vuex'
import {
  ITranslationData,
  LanguageState,
  ITranslationDataExtended,
  requestTranslations,
  ITranslationResponseData,
  requestUpdateEntity
} from '@/ADempiere/modules/persistence'
import { IValueData } from '@/ADempiere/modules/core'
import { IEntityData } from '../../PersistenceType'
import { IKeyValueObject } from '@/ADempiere/shared/utils/types'

type LanguageActionTree = ActionTree<LanguageState, IRootState>
type LanguageActionContext = ActionContext<LanguageState, IRootState>

export const actions: LanguageActionTree = {
  setTranslation(
    context: LanguageActionContext,
    payload: {
            containerUuid: string
            tableName: string
            recordUuid: string
            recordId: number
            translations: ITranslationData[]
        }
  ) {
    const {
      containerUuid,
      tableName,
      recordId,
      recordUuid,
      translations
    } = payload

    const currentTranslation = context.state.translationsList.find(
      (itemTrannslation: ITranslationDataExtended) => {
        return itemTrannslation.containerUuid === containerUuid
      }
    )

    const newTranlation: ITranslationDataExtended = {
      containerUuid,
      tableName,
      recordUuid,
      recordId,
      translations
    }

    if (currentTranslation) {
      if (currentTranslation.recordUuid === recordUuid) {
        const translationRecord = currentTranslation.translations.find(
          (itemTrannslation: ITranslationData) => {
            return (
              itemTrannslation.language ===
                            translations[0].language
            )
          }
        )
        if (!translationRecord) {
          context.commit('addTranslationToRecord', {
            translations: currentTranslation.translations,
            translationToAdd: translations[0]
          })
        } else {
          // there is translation for the language and change the values in the translation record
          context.commit('setTranslationToRecord', {
            currentTranslation: translationRecord,
            newValues: translations[0].values
          })
        }
      } else {
        // this same container uuid, and other record
        context.commit('addTranslationChangeRecord', {
          currentTranslation,
          newTranlation
        })
      }
    } else {
      // no translation has been uploaded to this container uuid
      context.commit('addTranslationToList', newTranlation)
    }
  },
  getTranslationsFromServer(
    context: LanguageActionContext,
    payload: {
            containerUuid: string
            language: string
            tableName: string
            recordUuid: string
            recordId?: number
        }
  ) {
    const {
      recordUuid,
      recordId = payload.recordId || 0,
      tableName,
      language,
      containerUuid
    } = payload
    return requestTranslations({
      uuid: recordUuid,
      id: recordId,
      tableName,
      language
    })
      .then((translationResponse: ITranslationResponseData) => {
        if (translationResponse.list.length < 1) {
          console.warn(translationResponse)
          return
        }

        const { values, uuid, language } = translationResponse.list[0]
        context.dispatch('setTranslation', {
          containerUuid,
          tableName,
          recordUuid,
          recordId,
          translations: [
            {
              language,
              uuid,
              values
            }
          ]
        })
        return values
      })
      .catch(error => {
        console.warn(
                    `Error Get Translations List ${error.message}. Code: ${error.code}.`
        )
      })
  },
  changeTranslationValue(
    context: LanguageActionContext,
    payload: {
            containerUuid: string
            language: string
            columnName: string
            recordUuid: string
            value: IValueData
        }
  ) {
    const { containerUuid, language, columnName, value, recordUuid: uuid } = payload
    return new Promise(resolve => {
      const translationData:
                | ITranslationDataExtended
                | undefined = context.state.translationsList.find(
                  (itemTranslation: ITranslationDataExtended) => {
                    return itemTranslation.containerUuid === containerUuid
                  }
                )
      const translationSelected:
                | ITranslationData
                | undefined = translationData!.translations.find(
                  (itemTranslation: ITranslationData) => {
                    return itemTranslation.language === language
                  }
                )

      const values: IKeyValueObject<IValueData>[] = translationSelected!.values
      // not change value

      if (values[0][columnName] === value) {
        resolve(value)
        return value
      }
      // IKeyValueObject<IValueData>[]
      return requestUpdateEntity({
        tableName: `${translationData!.tableName}_Trl`, // '_Trl' is suffix for translation tables
        uuid,
        attributes: [
          {
            key: columnName,
            value
          }
        ]
      })
        .then((responseEntity: IEntityData) => {
          const newValues: IKeyValueObject<IValueData> = {}
          Object.keys(values).forEach((key: string, index: number) => {
            newValues[key] = responseEntity.attributes[index].value
          })
          context.commit('setTranslationToRecord', {
            currentTranslation: translationSelected,
            newValues
          })
          resolve(newValues)
          return newValues
        })
        .catch((error: any) => {
          console.warn(
                        `Error Update Translation ${error.message}. Code: ${error.code}.`
          )
        })
    })
  }
}
