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
            isOverWriteParent: boolean
            attributes?: KeyValueData[]
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
  }
}
