import { getLocale } from '@/ADempiere/shared/lang'
// import { DeviceType } from '@/store/modules/app'
import { getSidebarStatus, getSize } from '@/utils/cookies'
import { DeviceType, IAppState } from '../AppType'

export const state: IAppState = {
  sidebar: {
    opened: getSidebarStatus() !== 'closed',
    withoutAnimation: false
  },
  device: DeviceType.Desktop,
  language: getLocale(),
  size: getSize() || 'medium'
}
