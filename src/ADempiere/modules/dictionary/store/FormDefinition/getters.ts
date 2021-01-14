import { GetterTree } from 'vuex'
import { FormDefinitionState } from '@/ADempiere/modules/dictionary'
import { IRootState } from '@/store'
import { IFormDataExtended } from '../../DictionaryType'

type FormDefinitionGetter = GetterTree<FormDefinitionState, IRootState>

export const getters: FormDefinitionGetter = {
  getForm: (state: FormDefinitionState) => (formUuid: string): IFormDataExtended | undefined => {
    return state.form.find(
      item => item.uuid === formUuid
    )
  },
  getIsShowTitleForm: (state: FormDefinitionState): boolean => {
    return state.isShowedTitleForm
  }
}
