import { IRootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { DeviceType, IAppState } from '../AppType'

type AppActionContext = ActionContext<IAppState, IRootState>
type AppActionTree = ActionTree<IAppState, IRootState>

export const actions: AppActionTree = {
  ToggleSideBar(context: AppActionContext, withoutAnimation: boolean) {
    context.commit('TOGGLE_SIDEBAR', withoutAnimation)
  },
  CloseSideBar(context: AppActionContext, withoutAnimation: boolean) {
    context.commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  ToggleDevice(context: AppActionContext, device: DeviceType) {
    context.commit('TOGGLE_DEVICE', device)
  },
  SetLanguage(context: AppActionContext, language: string) {
    context.commit('SET_LANGUAGE', language)
  },
  SetSize(context: AppActionContext, size: string) {
    context.commit('SET_SIZE', size)
  }
}
