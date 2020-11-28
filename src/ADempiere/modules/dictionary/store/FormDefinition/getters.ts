import { GetterTree } from 'vuex'
import { FormDefinitionState } from '@/ADempiere/modules/dictionary'
import { RootState } from '@/ADempiere/shared/store/types'

type FormDefinitionGetter = GetterTree<FormDefinitionState, RootState>

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
