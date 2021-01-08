import { MutationTree } from 'vuex'
import { FieldState, IFieldDataExtended } from '@/ADempiere/modules/dictionary'

type FieldActionTree = MutationTree<FieldState>

export const mutations: FieldActionTree = {
  addField(state: FieldState, payload: IFieldDataExtended) {
    state.fieldsList.push(payload)
  },
  //   addReference(state, payload) {
  //     state.referenceList.push(payload)
  //   },
  //   addValidationRule(state, payload) {
  //     state.validationRuleList.push(payload)
  //   },
  //   resetStateLookup(state) {
  //     state = initStateLookup
  //   },
  setShowedLocation(state: FieldState, isShowed: boolean) {
    state.isShowedLocation = isShowed
  },
  setFieldsListLocation(state: FieldState, fieldsListLocation) {
    state.fieldsListLocation = fieldsListLocation
  }
}
