import {
  requestFieldMetadata,
  FieldState,
  IFieldDataExtended
} from '@/ADempiere/modules/dictionary'
import { IRootState } from '@/store'
import { ActionTree, ActionContext } from 'vuex'
import { IFieldData } from '@/ADempiere/modules/field'

type FieldActionTree = ActionTree<FieldState, IRootState>
type FieldActionContext = ActionContext<FieldState, IRootState>

export const actions: FieldActionTree = {
  getFieldFromServer(
    context: FieldActionContext,
    payload: {
            uuid: string
            columnUuid?: string
            elementUuid?: string
            tableName?: string
            columnName?: string
            elementColumnName?: string
        }
  ) {
    const {
      uuid,
      columnName,
      elementColumnName,
      tableName,
      columnUuid,
      elementUuid
    } = payload
    return requestFieldMetadata({
      uuid,
      columnUuid,
      elementUuid,
      fieldUuid: uuid,
      // TableName + ColumnName
      tableName,
      columnName,
      elementColumnName
    })
      .then((fieldResponse: IFieldData) => {
        const field: IFieldDataExtended = {
          ...fieldResponse,
          columnUuid: columnUuid,
          elementUuid: elementUuid,
          elementColumnName: elementColumnName,
          columnName:
                        columnName && tableName
                          ? columnName
                          : fieldResponse.columnName,
          tableName: columnName && tableName ? tableName : undefined
        }

        context.commit('addField', fieldResponse)

        return field
      })
      .catch(error => {
        console.warn(
                    `Get Field - Error ${error.code}: ${error.message}.`
        )
      })
  },
  changeSequence(context: FieldActionContext, params: any) {
    context.commit('setFieldsListLocation', params)
  },
  setShowedLocation(context: FieldActionContext, isShowed: boolean) {
    context.commit('setShowedLocation', isShowed)
  }
}
