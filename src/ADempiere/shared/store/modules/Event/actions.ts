import { ActionContext, ActionTree } from 'vuex'
import { IRootState } from '@/store'
import {
  EventState,
  IActionEvent,
  IFieldEvent,
  IFieldEventExtended
} from './type'

type EventActionContext = ActionContext<EventState, IRootState>
type EventActionTree = ActionTree<EventState, IRootState>

export const actions: EventActionTree = {
  notifyActionPerformed(
    context: EventActionContext,
    event: IFieldEvent
  ): void {
    context.commit('addActionPerformed', {
      containerUuid: event.containerUuid,
      columnName: event.columnName,
      value: event.value
    })
  },
  notifyKeyPressed(
    context: EventActionContext,
    event: IFieldEventExtended
  ): void {
    context.commit('addKeyPressed', {
      containerUuid: event.containerUuid,
      columnName: event.columnName,
      value: event.value,
      keyCode: event.keyCode
    })
  },
  notifyKeyReleased(
    context: EventActionContext,
    event: IFieldEventExtended
  ): void {
    context.commit('addKeyReleased', {
      containerUuid: event.containerUuid,
      columnName: event.columnName,
      value: event.value,
      keyCode: event.keyCode
    })
  },
  notifyActionKeyPerformed(
    context: EventActionContext,
    event: IFieldEventExtended
  ) {
    context.commit('addActionKeyPerformed', {
      containerUuid: event.containerUuid,
      columnName: event.columnName,
      value: event.value,
      keyCode: event.keyCode
    })
  },
  notifyFocusGained(context: EventActionContext, event: IFieldEvent) {
    context.commit('addFocusGained', {
      containerUuid: event.containerUuid,
      columnName: event.columnName,
      value: event.value
    })
  },
  notifyFocusLost(context: EventActionContext, event: IFieldEvent) {
    context.commit('addFocusLost', {
      containerUuid: event.containerUuid,
      columnName: event.columnName,
      value: event.value
    })
  },
  runAction(context: EventActionContext, action: IActionEvent) {
    context.commit('addRunAction', {
      containerUuid: action.containerUuid,
      action: action.action,
      paremeters: action.parameters
    })
  }
}
