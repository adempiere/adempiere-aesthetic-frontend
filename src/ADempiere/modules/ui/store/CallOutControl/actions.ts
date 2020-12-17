import { IValueData } from '@/ADempiere/modules/core'
import { IWindowDataExtended } from '@/ADempiere/modules/dictionary'
import { RootState } from '@/ADempiere/shared/store/types'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { IFieldDataExtendedUtils } from '@/ADempiere/shared/utils/DictionaryUtils/type'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import { ActionContext, ActionTree } from 'vuex'
import { runCallOutRequest } from '../../UIService/rule'
import { CallOutControlState, ICallOutData } from '../../UITypes'
import language from '@/lang'
import { IPanelParameters } from '@/ADempiere/shared/store/modules/panel/type'

type CallOutControlActionContext = ActionContext<CallOutControlState, RootState>
type CallOutControlActionTree = ActionTree<CallOutControlState, RootState>

export const actions: CallOutControlActionTree = {
  /**
     * Run or execute callout to get values
     * @param {String} parentUuid
     * @param {String} containerUuid
     * @param {String} callout, path of callout to execute
     * @param {String} tableName
     * @param {String} columnName
     * @param {Array<String>} withOutColumnNames
     * @param {Boolean} inTable, indicate if is activate from table
     * @param {Object} row, if callout is activate in table
     * @param {Mixed} value
     * @param {Mixed} oldValue
     * @param {String} valueType
     * @return {Promise} values
     */
  runCallout(
    context: CallOutControlActionContext,
    payload: {
            parentUuid: string
            containerUuid: string
            callout: string
            tableName: string
            columnName: string
            withOutColumnNames?: string[]
            inTable?: boolean
            row: any
            value: IValueData
            oldValue: IValueData
            valueType?: string
        }
  ): Promise<Map<String, IValueData>> | undefined {
    const {
      parentUuid,
      containerUuid,
      columnName,
      callout,
      withOutColumnNames = payload.withOutColumnNames || [],
      inTable = payload.inTable || false,
      row,
      value,
      oldValue,
      tableName
    } = payload
    if (!value || !callout) {
      return undefined
    }
    //  Else
    return new Promise((resolve, reject) => {
      const window: IWindowDataExtended = context.rootGetters.getWindow(
        parentUuid
      )
      const attributesList: IPanelParameters[] = <IPanelParameters[]>context.rootGetters.getParametersToServer({
        containerUuid,
        row
      })

      runCallOutRequest({
        windowUuid: parentUuid,
        tabUuid: containerUuid,
        callout,
        tableName,
        columnName,
        value,
        oldValue,
        // valueType,
        attributesList,
        windowNo: window.windowIndex
      })
        .then((calloutResponse: ICallOutData) => {
          if (inTable) {
            const newValues = {
              ...row,
              ...calloutResponse.values
            }
            context.dispatch('notifyRowTableChange', {
              parentUuid,
              containerUuid,
              row: newValues,
              isEdit: true
            })
          } else {
            context.dispatch('notifyPanelChange', {
              parentUuid,
              containerUuid,
              panelType: PanelContextType.Window,
              newValues: calloutResponse.values,
              isSendToServer: false,
              withOutColumnNames,
              isSendCallout: false,
              isChangeFromCallout: true
            })
          }
          resolve(calloutResponse.values)
        })
        .catch(error => {
          reject(error)
          showMessage({
            message:
                            error.message || language.t('window.callout.error'),
            type: 'error'
          })
          console.warn(
                        `Field ${columnName} error callout. Code ${error.code}: ${error.message}`
          )
        })
    })
  }
}
