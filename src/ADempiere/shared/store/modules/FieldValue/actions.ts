import { KeyValueData } from '@/ADempiere/modules/persistence'
import { ActionContext, ActionTree } from 'vuex'
import { RootState } from '../../types'
import { FieldValueState } from './type'

type FieldValueActionContext = ActionContext<FieldValueState, RootState>
type FieldValueActionTree = ActionTree<FieldValueState, RootState>

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
