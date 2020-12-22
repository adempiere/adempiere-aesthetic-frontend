import { GetterTree } from 'vuex'
import { FormDefinitionState } from '@/ADempiere/modules/dictionary'
import { IRootState } from '@/store'

type FormDefinitionGetter = GetterTree<FormDefinitionState, IRootState>

export const getters: FormDefinitionGetter = {
  getForm: (state: FormDefinitionState) => (formUuid: string) => {
    return state.form.find(
      item => item.uuid === formUuid
    )
  },
  getIsShowTitleForm: (state: FormDefinitionState) => {
    return state.isShowedTitleForm
  }
}
