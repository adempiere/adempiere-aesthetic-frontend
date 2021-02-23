import { ISettingsState } from '../SettingsType'
import defaultSettings from '@/settings'
import elementVariables from '@/styles/element-variables.scss'

export const state: ISettingsState = {
  theme: elementVariables.theme,
  fixedHeader: defaultSettings.fixedHeader,
  showSettings: defaultSettings.showSettings,
  showTagsView: defaultSettings.showTagsView,
  showSidebarLogo: defaultSettings.showSidebarLogo,
  sidebarTextTheme: defaultSettings.sidebarTextTheme,
  // ADempiere
  supportPinyinSearch: defaultSettings.supportPinyinSearch,
  showContextMenu: defaultSettings.showContextMenu,
  showNavar: defaultSettings.showNavar,
  showMenu: true
}
