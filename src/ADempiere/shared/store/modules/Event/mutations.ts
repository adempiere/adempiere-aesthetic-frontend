import { MutationTree } from 'vuex'
import {
  EventState,
  IFieldEvent,
  IActionEvent,
  EventActionType,
  IFieldEventExtended
} from './type'

type EventMutationTree = MutationTree<EventState>

export const mutations: EventMutationTree = {
  addActionPerformed(state: EventState, change: Required<IFieldEvent>) {
    state.fieldEvents.push({
      ...change,
      eventType: EventActionType.ACTION_PERFORMED
    })
  },
  addKeyPressed(state: EventState, change: Required<IFieldEventExtended>) {
    state.fieldEvents.push({
      ...change,
      eventType: EventActionType.KEY_PRESSED
    })
  },
  addKeyReleased(state: EventState, change: Required<IFieldEventExtended>) {
    state.fieldEvents.push({
      ...change,
      eventType: EventActionType.KEY_RELEASED
    })
  },
  addActionKeyPerformed(
    state: EventState,
    change: Required<IFieldEventExtended>
  ) {
    state.fieldEvents.push(change)
  },
  addFocusGained(state: EventState, change: Required<IFieldEvent>) {
    state.fieldEvents.push({
      ...change,
      eventType: EventActionType.FOCUS_GAINED
    })
  },
  addFocusLost(state: EventState, change: Required<IFieldEvent>) {
    state.fieldEvents.push({
      ...change,
      eventType: EventActionType.FOCUS_LOST
    })
  },
  addRunAction(state: EventState, action: IActionEvent) {
    state.actionEvents.push(action)
  },
  resetStateLookup(state: EventState) {
    state = {
      fieldEvents: [],
      actionEvents: []
    }
  }
}
