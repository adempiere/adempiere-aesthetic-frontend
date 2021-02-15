import { IValueData } from '@/ADempiere/modules/core'
import { IRootState } from '@/store'
import { parseContext } from '@/ADempiere/shared/utils/contextUtils'
import { ActionContext, ActionTree } from 'vuex'
import { requestLookup, requestLookupList } from '@/ADempiere/modules/ui/UIService'
import {
  ILookupItemData,
  ILookupItemDataExtended,
  ILookupListExtended,
  ILookupListResponse,
  ILookupOptions,
  LookupState
} from '@/ADempiere/modules/ui/UITypes'
import { getToken as getSession } from '@/utils/cookies'
import { Namespaces } from '@/ADempiere/shared/utils/types'

type LookupActionContext = ActionContext<LookupState, IRootState>
type LookupActionTree = ActionTree<LookupState, IRootState>

export const actions: LookupActionTree = {
  /**
     * Get display column from lookup
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @param {string} tableName
     * @param {string} directQuery
     * @param {string|number} value identifier or key
     */
  getLookupItemFromServer(
    context: LookupActionContext,
    payload: {
            parentUuid: string
            containerUuid: string
            tableName: string
            directQuery: string
            value: string | number
        }
  ) {
    console.log('getLookupItemFromServer')
    console.log(payload)
    const {
      parentUuid,
      containerUuid,
      tableName,
      directQuery,
      value
    } = payload
    if (!directQuery) {
      return
    }

    console.log('prequery')
    console.log(directQuery)
    let parsedDirectQuery: string = directQuery
    if (parsedDirectQuery.includes('@')) {
      parsedDirectQuery = parseContext({
        parentUuid,
        containerUuid,
        value: directQuery,
        isBooleanToString: true
      }).value
    }

    console.log('parsedDirectQuery')
    console.log(parsedDirectQuery)

    return requestLookup({
      tableName,
      directQuery: parsedDirectQuery,
      value
    })
      .then((lookupItemResponse: ILookupItemData) => {
        const label: IValueData = lookupItemResponse.values.DisplayColumn
        const option: Required<ILookupOptions> = {
          label: (!label) ? ' ' : label,
          uuid: lookupItemResponse.uuid,
          id: value // lookupItemResponse.values.KeyColumn
        }
        const lookupItem: ILookupItemDataExtended = {
          option,
          value, // isNaN(objectParams.value) ? objectParams.value : parseInt(objectParams.value, 10),
          parsedDirectQuery: directQuery,
          tableName,
          sessionUuid: getSession()!,
          clientId: context.rootGetters[Namespaces.Preference + '/' + 'getPreferenceClientId']
        }
        context.commit('addLoockupItem', lookupItem)
        return option
      })
      .catch(error => {
        console.warn(
                    `Get Lookup, Select Base - Error ${error.code}: ${error.message}.`
        )
        console.log(payload)
        console.log('Directquery')
        console.log(directQuery)
        console.log('parsedQuery')
        console.log(parsedDirectQuery)
        console.log(directQuery === parsedDirectQuery)
      })
  },
  /**
     * Get display column's list from lookup
     * @param {string}  parentUuid
     * @param {string}  containerUuid
     * @param {string}  tableName
     * @param {string}  query
     * @param {string}  whereClause
     * @param {boolean} isAddBlankValue
     * @param {mixed}   blankValue
     * @param {Array<String>|<Number>}  valuesList
     */
  getLookupListFromServer(
    context: LookupActionContext,
    payload: {
            parentUuid: string
            containerUuid: string
            columnName?: string
            tableName: string
            query: string
            whereClause?: string
            isAddBlankValue: boolean
            blankValue: any
            valuesList: (string | number)[]
        }
  ): Promise<ILookupOptions[] | void> | undefined {
    const {
      parentUuid,
      columnName = payload.columnName || payload.tableName,
      containerUuid,
      tableName,
      query,
      whereClause,
      isAddBlankValue = payload.isAddBlankValue || false,
      blankValue,
      valuesList = payload.valuesList || []
    } = payload
    if (!query) {
      return
    }
    let parsedQuery: string = query
    if (String(parsedQuery).includes('@')) {
      parsedQuery = parseContext({
        parentUuid,
        containerUuid,
        value: query,
        isBooleanToString: true
      }).value
    }

    let parsedWhereClause: string = whereClause!
    if (String(parsedWhereClause).includes('@')) {
      parsedWhereClause = parseContext({
        parentUuid,
        containerUuid,
        value: parsedWhereClause,
        isBooleanToString: true
      }).value
    }

    return requestLookupList({
      columnName,
      tableName,
      query: parsedQuery,
      whereClause: parsedWhereClause,
      valuesList
    })
      .then((lookupListResponse: ILookupListResponse) => {
        const list: ILookupOptions[] = []
        lookupListResponse.list.forEach(
          (itemLookup: ILookupItemData) => {
            const {
              KeyColumn: id,
              DisplayColumn: label
            } = itemLookup.values

            if (id) {
              list.push({
                label,
                id: <number>id,
                uuid: itemLookup.uuid
              })
            }
          }
        )
        if (isAddBlankValue) {
          list.unshift({
            label: ' ',
            id: blankValue,
            uuid: undefined
          })
        }

        const lookupList: ILookupListExtended = {
          list,
          tableName,
          parsedQuery,
          sessionUuid: getSession()!,
          clientId: context.rootGetters[Namespaces.Preference + '/' + 'getPreferenceClientId']
        }
        context.commit('addLoockupList', lookupList)

        return list
      })
      .catch(error => {
        console.warn(
                    `Get Lookup List, Select Base - Error ${error.code}: ${error.message}.`
        )
      })
  },
  deleteLookupList(
    context: LookupActionContext,
    payload: {
            parentUuid: string
            containerUuid: string
            tableName: string
            query: string
            directQuery: string
            value: IValueData
        }
  ) {
    const {
      parentUuid,
      containerUuid,
      tableName,
      query,
      directQuery,
      value
    } = payload
    let parsedDirectQuery: string = directQuery
    if (directQuery && parsedDirectQuery.includes('@')) {
      parsedDirectQuery = parseContext({
        parentUuid,
        containerUuid,
        value: parsedDirectQuery,
        isBooleanToString: true
      }).value
    }
    const lookupItem: ILookupItemDataExtended[] = context.state.lookupItem.filter(
      (itemLookup: ILookupItemDataExtended) => {
        return (
          itemLookup.parsedDirectQuery !== parsedDirectQuery &&
                    itemLookup.tableName !== tableName &&
                    itemLookup.value !== value &&
                    itemLookup.sessionUuid !== getSession()
        )
      }
    )

    let parsedQuery: string = query
    if (parsedQuery && parsedQuery.includes('@')) {
      parsedQuery = parseContext({
        parentUuid,
        containerUuid,
        value: parsedQuery,
        isBooleanToString: true
      }).value
    }
    const lookupList: ILookupListExtended[] = context.state.lookupList.filter(
      (itemLookup: ILookupListExtended) => {
        return (
          itemLookup.parsedQuery !== parsedQuery &&
                    itemLookup.tableName !== tableName &&
                    itemLookup.sessionUuid !== getSession()
        )
      }
    )
    context.commit('deleteLookupList', {
      lookupItem,
      lookupList
    })
  }
}
