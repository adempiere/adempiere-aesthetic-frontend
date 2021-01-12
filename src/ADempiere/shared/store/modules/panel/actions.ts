import { IdentifierColumnsData, IPanelDataExtended } from '@/ADempiere/modules/dictionary'
import { assignedGroup } from '@/ADempiere/shared/utils/DictionaryUtils'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { ActionContext, ActionTree } from 'vuex'
import { IRootState } from '@/store'
import { PanelState } from './type'
import { IFieldDataExtendedUtils } from '@/ADempiere/shared/utils/DictionaryUtils/type'
import { Route } from 'vue-router'

type PanelActionContext = ActionContext<PanelState, IRootState>
type PanelActionTree = ActionTree<PanelState, IRootState>

export const actions: PanelActionTree = {
  addPanel(context: PanelActionContext, params: IPanelDataExtended): IPanelDataExtended {
    const {
      panelType,
      // isParentTab,
      // parentUuid,
      uuid: containerUuid
    } = params
    let keyColumn = ''
    let selectionColumn: string[] = []
    let identifierColumns: IdentifierColumnsData[] = []
    let count = 0

    if (params.fieldsList) {
      params.fieldsList.forEach((itemField, index, listFields) => {
        if (itemField.isKey) {
          keyColumn = itemField.columnName
        }
        if (itemField.isSelectionColumn) {
          selectionColumn.push(itemField.columnName)
        }
        if (itemField.isIdentifier) {
          identifierColumns.push({
            columnName: itemField.columnName,
            identifierSequence: itemField.identifierSequence,
            componentPath: itemField.componentPath || ''
          })
        }
        if (panelType === PanelContextType.Table || params.isAdvancedQuery) {
          itemField.isShowedFromUser = false
          if (count < 2 && itemField.isSelectionColumn && itemField.sequence >= 10) {
            itemField.isShowedFromUser = true
            count++
          }
        }
        //  For all
        if ([PanelContextType.Browser, PanelContextType.Process, PanelContextType.Report, PanelContextType.Form, PanelContextType.Table].includes(panelType) ||
              (panelType === PanelContextType.Window && params.isParentTab)) {
          // TODO: Verity with updateValueOfField, setContext, setPreferenceContext
          // commit('updateValueOfField', {
          //   parentUuid,
          //   containerUuid,
          //   // isOverWriteParent: Boolean(isParentTab),
          //   columnName: itemField.columnName,
          //   value: itemField.value
          // })
        }
        //  Get dependent fields
        if (itemField.parentFieldsList && itemField.isActive) {
          itemField.parentFieldsList.forEach(parentColumnName => {
            const parentField: IFieldDataExtendedUtils | undefined = listFields.find(parentFieldItem => {
              return parentFieldItem.columnName === parentColumnName &&
                    parentColumnName !== itemField.columnName
            })
            if (parentField) {
                  parentField.dependentFieldsList!.push(itemField.columnName)
            }
          })
        }
      })

      let orderBy = 'sequence'
      if ((panelType === PanelContextType.Window && !params.isParentTab) || panelType === PanelContextType.Browser) {
        orderBy = 'seqNoGrid'
      }
      params.fieldsList = assignedGroup({
        fieldsList: params.fieldsList,
        orderBy
      })!
    }

    params.keyColumn = keyColumn
    if (params.isSortTab) {
      const panelParent: any = context.getters.getPanel(params.tabAssociatedUuid)
      selectionColumn = selectionColumn.concat(panelParent.selectionColumn)
      identifierColumns = identifierColumns.concat(panelParent.identifierColumns)
      params.fieldLinkColumnName = panelParent.fieldLinkColumnName
      params.keyColumn = panelParent.keyColumn
    }
    params.selectionColumn = selectionColumn
    params.identifierColumns = identifierColumns
      .sort((itemA, itemB) => {
        return itemA.identifierSequence - itemB.identifierSequence
      })

    params.recordUuid = null
    // show/hidden optionals columns to table
    params.isShowedTableOptionalColumns = false

    context.commit('addPanel', params)

    if (!['table'].includes(panelType)) {
      context.dispatch('setDefaultValues', {
        parentUuid: params.parentUuid,
        containerUuid,
        // isOverWriteParent: Boolean(isParentTab),
        panelType
      })
    }
    if (params.isCustomForm) {
      context.dispatch('addForm', params)
    }

    return params
  },
  getPanelAndFields(context: PanelActionContext, payload: {
    parentUuid: string
    containerUuid: string
    panelType: PanelContextType
    panelMetadata: any
    routeToDelete: Route
    isAdvancedQuery?: boolean
  }) {
    const { isAdvancedQuery = payload.isAdvancedQuery || false, panelType, parentUuid, containerUuid, panelMetadata, routeToDelete } = payload
    let executeAction: string
    switch (panelType) {
      case PanelContextType.Process:
      case PanelContextType.Report:
        executeAction = 'getProcessFromServer'
        break
      case PanelContextType.Browser:
        executeAction = 'getBrowserFromServer'
        break
      case PanelContextType.Form:
        executeAction = 'getFormFromServer'
        break
      case PanelContextType.Window:
      case PanelContextType.Table:
      default:
        executeAction = 'getFieldsFromTab'
        break
    }

    return context.dispatch(executeAction, {
      parentUuid,
      containerUuid,
      panelType,
      panelMetadata,
      isAdvancedQuery,
      routeToDelete
    })
      .then(panelResponse => {
        return panelResponse
      })
      .catch(error => {
        return {
          ...error,
          moreInfo: `Dictionary getPanelAndFields ${panelType} (State Panel).`
        }
      })
  }
}
