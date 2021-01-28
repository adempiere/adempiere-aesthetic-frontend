import { IValueData } from '@/ADempiere/modules/core'
import { IRootState } from '@/store'
import { parseContext } from '@/ADempiere/shared/utils/contextUtils'
import { ActionContext, GetterTree } from 'vuex'
import { getToken as getSession } from '@/utils/cookies'
import {
  ILookupItemDataExtended,
  ILookupListExtended,
  ILookupOptions,
  LookupState
} from '@/ADempiere/modules/ui/UITypes'
import { Namespaces } from '@/ADempiere/shared/utils/types'

type LookupGettersTree = GetterTree<LookupState, IRootState>
type LookupActionContext = ActionContext<LookupState, IRootState>

export const getters: LookupGettersTree = {
  getLookupItem: (
    state: LookupState,
    context: LookupActionContext
  ) => (parameters: {
        parentUuid: string
        containerUuid: string
        tableName: string
        directQuery: string
        value: IValueData
    }): Required<ILookupOptions> | undefined => {
    const {
      parentUuid,
      containerUuid,
      tableName,
      directQuery,
      value
    } = parameters

    let parsedDirectQuery: string = directQuery
    if (parsedDirectQuery && parsedDirectQuery.includes('@')) {
      parsedDirectQuery = parseContext({
        parentUuid,
        containerUuid,
        value: parsedDirectQuery,
        isBooleanToString: true
      }).value
    }
    const lookupItem:
            | ILookupItemDataExtended
            | undefined = state.lookupItem.find(
              (itemLookup: ILookupItemDataExtended) => {
                return (
                  itemLookup.parsedDirectQuery === parsedDirectQuery &&
                    itemLookup.tableName === tableName &&
                    itemLookup.sessionUuid === getSession() &&
                    itemLookup.clientId ===
                        context.rootGetters[Namespaces.Preference + '/' + 'getPreferenceClientId'] &&
                    itemLookup.value === value
                )
              }
            )
    if (lookupItem) {
      return lookupItem.option
    }
    return undefined
  },
  getLookupList: (
    state: LookupState,
    context: LookupActionContext
  ) => (parameters: {
        parentUuid: string
        containerUuid: string
        tableName: string
        query: string
    }): ILookupOptions[] => {
    const { parentUuid, containerUuid, tableName, query } = parameters
    let parsedQuery: string = query
    if (parsedQuery && parsedQuery.includes('@')) {
      parsedQuery = parseContext({
        parentUuid,
        containerUuid,
        value: parsedQuery,
        isBooleanToString: true
      }).value
    }
    const lookupList:
            | ILookupListExtended
            | undefined = state.lookupList.find(
              (itemLookup: ILookupListExtended) => {
                return (
                  itemLookup.parsedQuery === parsedQuery &&
                    itemLookup.tableName === tableName &&
                    itemLookup.sessionUuid === getSession() &&
                    itemLookup.clientId ===
                        context.rootGetters[Namespaces.Preference + '/' + 'getPreferenceClientId']
                )
              }
            )
    if (lookupList) {
      return lookupList.list
    }
    return []
  },
  /**
     * Get all lookups, item and list joined
     */
  getLookupAll: (
    state: LookupState,
    getters
  ) => (parameters: {
        parentUuid: string
        containerUuid: string
        tableName: string
        query: string
        directQuery: string
        value: IValueData
    }) => {
    const {
      parentUuid,
      containerUuid,
      tableName,
      query,
      directQuery,
      value
    } = parameters
    const list: ILookupOptions[] = getters.getLookupList({
      parentUuid,
      containerUuid,
      tableName,
      query
    })

    const allList: ILookupOptions[] = list
    // set item values getter from server into list
    if (!list) {
      const item:
                | Required<ILookupOptions>
                | undefined = getters.getLookupItem({
                  parentUuid,
                  containerUuid,
                  tableName,
                  directQuery,
                  value
                })
      if (item) {
        allList.push(item)
      }
    }
    return allList
  }
}
