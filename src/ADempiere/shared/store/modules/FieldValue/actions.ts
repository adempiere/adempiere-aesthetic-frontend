import { KeyValueData } from '@/ADempiere/modules/persistence'
import { ActionContext, ActionTree } from 'vuex'
import { IRootState } from '@/store'
import { FieldValueState } from './type'

type FieldValueActionContext = ActionContext<FieldValueState, IRootState>
type FieldValueActionTree = ActionTree<FieldValueState, IRootState>

export const actions: FieldValueActionTree = {
  updateValuesOfContainer(
    context: FieldValueActionContext,
    payload: {
            parentUuid: string
            containerUuid: string
            isOverWriteParent?: boolean
            attributes?: Partial<KeyValueData>[]
        }
  ) {
    const {
      parentUuid,
      containerUuid,
      isOverWriteParent,
      attributes = payload.attributes || []
    } = payload

    context.commit('updateValuesOfContainer', {
      parentUuid,
      containerUuid,
      isOverWriteParent,
      attributes
    })
  },
  updateValueOfField(context: FieldValueActionContext, payload: {
    parentUuid?: string
    containerUuid: string
    columnName: string
    value: any
    isOverWriteParent?: boolean
  }) {
    const {
      parentUuid,
      columnName,
      containerUuid,
      value,
      isOverWriteParent
    } = payload
    context.commit('updateValueOfField', {
      parentUuid: parentUuid,
      containerUuid: containerUuid,
      columnName: columnName,
      value,
      isOverWriteParent
    })
  }
}
