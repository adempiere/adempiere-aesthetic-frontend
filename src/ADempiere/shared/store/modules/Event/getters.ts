import { GetterTree } from 'vuex'
import { RootState } from '../../types'
import { EventState, IActionEvent, IFieldEvent, IFieldEventExtended } from './type'

type EventGetterTree = GetterTree<EventState, RootState>

export const getters: EventGetterTree = {
  getFieldEventList: (state: EventState) => (
    containerUuid: string
  ): IFieldEvent| IFieldEventExtended | undefined => {
    return state.fieldEvents.find((event: IFieldEvent | IFieldEventExtended) => {
      return event.containerUuid === containerUuid
    })
  },
  getActionEventList: (state: EventState) => (
    containerUuid: string
  ): IActionEvent | undefined => {
    return state.actionEvents.find((action: IActionEvent) => {
      return action.containerUuid === containerUuid
    })
  }
}
