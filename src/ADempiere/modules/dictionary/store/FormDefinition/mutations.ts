import { MutationTree } from 'vuex'
import { FormDefinitionState, IFormDataExtended } from '@/ADempiere/modules/dictionary'

type FormDefinitionMutationTree = MutationTree<FormDefinitionState>

export const mutations : FormDefinitionMutationTree = {
  addForm(state: FormDefinitionState, payload: IFormDataExtended) {
    state.form.push(payload)
  },
  dictionaryResetCacheForm(state: FormDefinitionState) {
    state.form = []
  },
  changeFormAttribute(state: FormDefinitionState, payload: {
          attributeName: number
          attributeValue: IFormDataExtended
          attributeNameControl?: number
          form: IFormDataExtended[]
      }) {
    let value: IFormDataExtended = payload.attributeValue
    if (payload.attributeNameControl) {
      value = payload.form[payload.attributeNameControl]
    }
    if (payload.attributeName) {
      payload.form[payload.attributeName] = value
    }
  },
  changeShowTitleForm(state: FormDefinitionState, isShowed: boolean) {
    state.isShowedTitleForm = isShowed
  }
}
