import { KeyValueData } from '@/ADempiere/modules/persistence/PersistenceType'
import { IKeyValueObject } from '@/ADempiere/shared/utils/types'
import { convertStringToBoolean } from '@/ADempiere/shared/utils/valueFormat'
import { GetterTree } from 'vuex'
import { IRootState } from '@/store'
import { FieldValueState } from './type'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'

type FieldValueGetterTree = GetterTree<FieldValueState, IRootState>

const UUID_KEY = 'UUID'

export const getters: FieldValueGetterTree = {
  getValueOfField: (state: FieldValueState) => (parameters: {
        parentUuid?: string
        containerUuid: string
        columnName: string
    }): any => {
    const { parentUuid, containerUuid, columnName } = parameters
    let key = ''
    let value: any
    if (containerUuid) {
      // get in tab level
      key += containerUuid + '_'
    }
    key += columnName
    value = state.field[key]

    if (parentUuid && isEmptyValue(value)) {
      // get in window level
      key = parentUuid + '_' + columnName
      value = state.field[parentUuid + '_' + columnName]
    }

    return value
  },
  /**
     * Get values and column's name as key (without parent uuid or container
     * uuid), from a view (container)
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @returns {object|array}
     */
  getValuesView: (state: FieldValueState) => (parameters: {
        parentUuid?: string
        containerUuid: string
        isOnlyColumns?: boolean
        format?: string
    }): IKeyValueObject | KeyValueData[] => {
    const {
      parentUuid = parameters.parentUuid || '',
      containerUuid,
      isOnlyColumns = parameters.isOnlyColumns || true,
      format = parameters.format || 'array'
    } = parameters
    // generate context with parent uuid or container uuid associated
    const contextAllContainers: IKeyValueObject = {}
    Object.keys(state.field).forEach((key: string) => {
      if (key.includes(parentUuid) || key.includes(containerUuid)) {
        contextAllContainers[key] = state.field[key]
      }
    })

    // generate context only columnName
    const objectValues: IKeyValueObject = {}
    const pairsValues: KeyValueData[] = Object.keys(
      contextAllContainers
    ).map(key => {
      const value = contextAllContainers[key]
      if (isOnlyColumns) {
        key = key
          .replace(`${parentUuid}_`, '')
          .replace(`${containerUuid}_`, '')
      }
      // TODO: Verify if overwrite key with empty value
      // const columnName: string = key

      // set container context (smart browser, process/report, form)
      objectValues[key] = value
      // objectValues[columnName] = value
      return {
        // columnName,
        key,
        value
      }
    })

    if (format === 'array') {
      return pairsValues
    }
    return objectValues
  },
  getUuidOfContainer: (state: FieldValueState) => (
    containerUuid: string
  ): any => {
    return state.field[containerUuid + '_' + UUID_KEY]
  },
  // Using to read only in data tables in Window
  getContainerIsActive: (state: FieldValueState) => (
    parentUuid: string
  ): boolean => {
    const valueIsActive = state.field[`${parentUuid}_IsActive`]

    return convertStringToBoolean(valueIsActive)
  },
  getContainerProcessing: (state: FieldValueState) => (
    parentUuid: string
  ): boolean => {
    const valueProcessing = state.field[`${parentUuid}_Processing`]

    return convertStringToBoolean(valueProcessing)
  },
  getContainerProcessed: (state: FieldValueState) => (
    parentUuid: string
  ): boolean => {
    const valueProcessed = state.field[`${parentUuid}_Processed`]

    return convertStringToBoolean(valueProcessed)
  },
  getAllField: (state: FieldValueState) => {
    return state.field
  }
}
