import { setLanguage, setSidebarStatus, setSize } from '@/utils/cookies'
import { MutationTree } from 'vuex'
import { DeviceType, IAppState } from '../AppType'

type AppMutationTree = MutationTree<IAppState>

export const mutations: AppMutationTree = {
  TOGGLE_SIDEBAR(state: IAppState, withoutAnimation: boolean) {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = withoutAnimation
    if (state.sidebar.opened) {
      setSidebarStatus('opened')
    } else {
      setSidebarStatus('closed')
    }
  },
  CLOSE_SIDEBAR(state: IAppState, withoutAnimation: boolean) {
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
    setSidebarStatus('closed')
  },
  TOGGLE_DEVICE(state: IAppState, device: DeviceType) {
    state.device = device
  },
  SET_LANGUAGE(state: IAppState, language: string) {
    state.language = language
    setLanguage(state.language)
  },
  SET_SIZE(state: IAppState, size: string) {
    state.size = size
    setSize(state.size)
  }
}
