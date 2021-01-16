import { GetterTree } from 'vuex'
import { FieldState } from '@/ADempiere/modules/dictionary'
import { IRootState } from '@/store'

type FieldGetter = GetterTree<FieldState, IRootState>

export const getters: FieldGetter = {
  getIsShowedLocation: (state: FieldState): boolean => {
    return state.isShowedLocation
  },
  getFieldFromUuid: (state: FieldState) => (uuid: string) => {
    return state.fieldsList.find(fieldItem => {
      return fieldItem.uuid === uuid
    })
  },
  getFieldFromColumnUuid: (state: FieldState) => (columnUuid: string) => {
    return state.fieldsList.find(fieldItem => {
      return fieldItem.columnUuid === columnUuid
    })
  },
  getFieldFromElementUuid: (state: FieldState) => (elementUuid: string) => {
    return state.fieldsList.find(fieldItem => {
      return fieldItem.elementUuid === elementUuid
    })
  },
  getFieldFromElementColumnName: (state: FieldState) => (
    elementColumnName: string
  ) => {
    return state.fieldsList.find(fieldItem => {
      return fieldItem.elementColumnName === elementColumnName
    })
  },
  getFieldFromTableNameAndColumnName: (state: FieldState) => (payload: {
        tableName: string
        columnName: string
    }) => {
    return state.fieldsList.find(fieldItem => {
      const { tableName, columnName } = payload
      return (
        fieldItem.tableName === tableName &&
                fieldItem.columnName === columnName
      )
    })
  },
  getFieldLocation: (state): any[] => {
    return state.fieldsListLocation
  }
}
