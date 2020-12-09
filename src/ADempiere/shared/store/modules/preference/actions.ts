import { ActionTree, ActionContext } from 'vuex'
import { PreferenceState } from './state'
import { RootState } from '@/ADempiere/shared/store/types'
import { typeValue } from '@/ADempiere/shared/utils/valueUtils'

type PreferenceActionTree = ActionTree<PreferenceState, RootState>
type PreferenceActionContext = ActionContext<PreferenceState, RootState>

export const actions : PreferenceActionTree = {
  setPreferenceContext(context: PreferenceActionContext, objectValue: any) {
    context.commit('setPreferenceContext', objectValue)
  },
  setMultiplePreference(context: PreferenceActionContext, payload: {
        parentUuid: string
        containerUuid: string
        values: any
      }) {
    const { parentUuid, containerUuid, values } = payload

    const typeOfValue : string = typeValue(values)

    let actionToDispatch = 'setMultiplePreferenceObject'
    if (typeOfValue === 'MAP') {
      actionToDispatch = 'setMultiplePreferenceMap'
    } else if (typeOfValue === 'ARRAY') {
      actionToDispatch = 'setMultiplePreferenceArray'
    }

    return context.dispatch(actionToDispatch, {
      parentUuid,
      containerUuid,
      values
    })
  },
  setMultiplePreferenceArray(context: PreferenceActionContext, payload: {
        parentUuid: string
        containerUuid: string
        values: any[]
      }) : void {
    const { parentUuid, containerUuid, values } = payload
    values.forEach((element: any) => {
      context.commit('setPreferenceContext', {
        parentUuid,
        containerUuid,
        columnName: element.key,
        value: element.value
      })
    })
  },
  setMultiplePreferenceObject(context: PreferenceActionContext, payload: {
        parentUuid: string
        containerUuid: string
        values: any
      }) {
    const { parentUuid, containerUuid, values } = payload
    if (containerUuid || parentUuid) {
      Object.keys(values).forEach(key => {
        context.commit('setPreferenceContext', {
          parentUuid,
          containerUuid,
          columnName: key,
          value: values[key]
        })
      })
    } else {
      context.commit('setMultiplePreference', values)
    }
  },
  setMultiplePreferenceMap(context: PreferenceActionContext, payload: {
        parentUuid: string
        containerUuid: string
        values: any
      }) {
    const { parentUuid, containerUuid, values } = payload
    if (containerUuid || parentUuid) {
      values.forEach((value: any, key: string) => {
        context.commit('setPreferenceContext', {
          parentUuid,
          containerUuid,
          columnName: key,
          value
        })
      })
    } else {
      context.commit('setMultiplePreference', Object.fromEntries(values))
    }
  }
}
