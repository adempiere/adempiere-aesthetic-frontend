import { KeyValueData } from '@/ADempiere/modules/persistence'
import Vue from 'vue'
import { MutationTree } from 'vuex'
import { FieldValueState } from './type'

type FieldValueMutationTree = MutationTree<FieldValueState>

export const mutations: FieldValueMutationTree = {
  resetStatevalue(state: FieldValueState): void {
    state = {
      field: {}
    }
  },
  /**
     *
     * @param {string}  parentUuid
     * @param {string}  containerUuid
     * @param {string}  columnName
     * @param {mixed}   value
     * @param {boolean} isOverWriteParent // overwite parent context values
     */
  updateValueOfField(state: FieldValueState, payload: {
        parentUuid: string
        containerUuid: string
        columnName: string
        value: any
        isOverWriteParent?: boolean
      }): void {
    const {
      parentUuid,
      columnName,
      containerUuid,
      value,
      isOverWriteParent = payload.isOverWriteParent || true
    } = payload
    // Only Parent
    if (parentUuid) {
      const keyParent: string = parentUuid + '_' + columnName
      const valueParent: any = state.field[keyParent]
      if (value !== valueParent) {
        if (isOverWriteParent) {
          Vue.set(state.field, keyParent, value)
        } else {
          if (value) {
            // tab child no replace parent context with empty
            Vue.set(state.field, keyParent, value)
          }
        }
      }
    }

    // Only Container
    if (containerUuid) {
      const keyContainer: string = containerUuid + '_' + columnName
      if (value !== state.field[keyContainer]) {
        Vue.set(state.field, keyContainer, value)
      }
    }
  },
  updateValuesOfContainer(state: FieldValueState, payload: {
          parentUuid: string
          containerUuid: string
          isOverWriteParent: boolean
          attributes: KeyValueData[]
      }): void {
    const { parentUuid, containerUuid, isOverWriteParent } = payload
    payload.attributes.forEach(attribute => {
      // const { value, columnName } = attribute
      const { value, key } = attribute

      // Only Parent
      if (parentUuid) {
        // const keyParent = parentUuid + '_' + columnName
        const keyParent: string = parentUuid + '_' + key
        const valueParent: string = state.field[keyParent]
        if (value !== valueParent) {
          if (isOverWriteParent) {
            Vue.set(state.field, keyParent, value)
          } else {
            if (value) {
              // tab child no replace parent context with empty
              Vue.set(state.field, keyParent, value)
            }
          }
        }
      }

      // Only Container
      if (containerUuid) {
        // const keyContainer: string = containerUuid + '_' + columnName
        const keyContainer: string = containerUuid + '_' + key
        if (value !== state.field[keyContainer]) {
          Vue.set(state.field, keyContainer, value)
        }
      }
    })
  }
}
