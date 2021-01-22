import { IFieldDataExtendedUtils } from '@/ADempiere/shared/utils/DictionaryUtils/type'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import { ActionTree, ActionContext } from 'vuex'
import language from '@/ADempiere/shared/lang'
import { fieldIsDisplayed } from '@/ADempiere/shared/utils/DictionaryUtils'
import { BrowserDefinitionState, IBrowserDataExtended, IPanelDataExtended } from '@/ADempiere/modules/dictionary'
import { IEntityData, IEntityListData, IRecordSelectionData } from '../../PersistenceType'
import { parseContext } from '@/ADempiere/shared/utils/contextUtils'
import { requestBrowserSearch } from '../../PersistenceService/browser'
import { IRootState } from '@/store'

type BrowserActionTree = ActionTree<BrowserDefinitionState, IRootState>
type BrowserActionContext = ActionContext<BrowserDefinitionState, IRootState>

export const actions: BrowserActionTree = {
  browserActionPerformed(context: BrowserActionContext, params: {
        containerUuid: string
        field: IFieldDataExtendedUtils
        value: any
      }) {
    const { containerUuid, field, value } = params
    const fieldsEmpty: string[] = context.getters.getFieldsListEmptyMandatory({
      containerUuid,
      fieldsList: context.getters.getFieldsListFromPanel(containerUuid)
    })
    if (fieldsEmpty) {
      showMessage({
        message: language.t('notifications.mandatoryFieldMissing').toString() + fieldsEmpty,
        type: 'info'
      })
      return
    }

    // Validate if a field is called and visible
    if (fieldIsDisplayed(field)) {
      let isReadyForQuery = true
      if (field.isSQLValue) {
        const panel: IPanelDataExtended = context.getters.getPanel(containerUuid)
        let awaitForValuesToQuery = panel.awaitForValuesToQuery
        awaitForValuesToQuery--
        context.dispatch('changeBrowserAttribute', {
          containerUuid,
          attributeName: 'awaitForValuesToQuery',
          attributeValue: awaitForValuesToQuery
        })
        if (awaitForValuesToQuery === 0) {
          if (panel.isShowedCriteria) {
            context.dispatch('changeBrowserAttribute', {
              containerUuid,
              attributeName: 'isShowedCriteria',
              attributeValue: false
            })
          }
        } else if (awaitForValuesToQuery > 0) {
          isReadyForQuery = false
        }
      }
      if (isReadyForQuery && !field.dependentFieldsList!.length) {
        context.dispatch('getBrowserSearch', {
          containerUuid,
          isClearSelection: true
        })
      }
    }
  },
  // Search with query criteria
  getBrowserSearch(context: BrowserActionContext, params: {
        containerUuid: string
        isClearSelection?: boolean
      }) {
    const { containerUuid, isClearSelection = params.isClearSelection || false } = params
    showMessage({
      // title: language.t('notifications.loading').toString(),
      message: language.t('notifications.searching').toString(),
      type: 'info'
    })
    const allData: IRecordSelectionData = context.rootGetters.getDataRecordAndSelection(containerUuid)
    // deletes the data from the container to replace it and to report the searches in the table
    context.dispatch('deleteRecordContainer', {
      viewUuid: containerUuid
    })

    const browser: IBrowserDataExtended = context.rootGetters.getBrowser(containerUuid)
    // parameters isQueryCriteria
    const parametersList = context.rootGetters.getParametersToServer({
      containerUuid,
      fieldsList: browser.fieldsList
    })

    let parsedQuery: string = browser.query
    if ((parsedQuery) && parsedQuery.includes('@')) {
      parsedQuery = parseContext({
        containerUuid,
        value: parsedQuery,
        isBooleanToString: true
      }).value
    }

    let parsedWhereClause = browser.whereClause
    if ((parsedWhereClause) && parsedWhereClause.includes('@')) {
      parsedWhereClause = parseContext({
        containerUuid,
        value: parsedWhereClause,
        isBooleanToString: true
      }).value
    }

    let nextPageToken = ''
    if (allData.nextPageToken) {
      nextPageToken = allData.nextPageToken + '-' + allData.pageNumber
    }

    // TODO: Add validation compare browserSearchQueryParameters
    return requestBrowserSearch({
      uuid: containerUuid,
      query: parsedQuery,
      whereClause: parsedWhereClause,
      orderByClause: browser.orderByClause,
      parametersList,
      pageToken: nextPageToken
    })
      .then((browserSearchResponse: IEntityListData) => {
        const recordsList = browserSearchResponse.recordsList.map((itemRecord: IEntityData) => {
          const values = itemRecord.attributes

          return {
            ...values,
            // datatables attributes
            isNew: false,
            isEdit: false,
            isReadOnlyFromRow: false
          }
        })

        let selection = allData.selection
        if (isClearSelection) {
          selection = []
        }

        let token = browserSearchResponse.nextPageToken
        if (token !== undefined) {
          token = token.slice(0, -2)
        }

        context.dispatch('setRecordSelection', {
          containerUuid,
          record: recordsList,
          pageNumber: context.rootGetters.getPageNumber(containerUuid),
          selection: selection,
          recordCount: browserSearchResponse.recordCount,
          nextPageToken: token
        })
        showMessage({
          // title: language.t('notifications.succesful').toString(),
          message: language.t('notifications.succcessSearch').toString(),
          type: 'success'
        })
        return recordsList
      })
      .catch(error => {
        // Set default registry values so that the table does not say loading,
        // there was already a response from the server
        context.dispatch('setRecordSelection', {
          containerUuid,
          panelType: 'browser'
        })

        showMessage({
          // title: language.t('notifications.error').toString(),
          message: language.t('notifications.errorSearch').toString(),
          // summary: error.message,
          type: 'error'
        })
        console.warn(`Error getting browser search: ${error.message}. Code: ${error.code}.`)
      })
  }
}
