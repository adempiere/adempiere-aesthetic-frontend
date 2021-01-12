import { UtilsState } from './type'

export const state: UtilsState = {
  width: 0,
  height: 0,
  splitHeight: 50,
  splitHeightTop: 0,
  widthLayout: 0,
  tempShareLink: '',
  oldAction: undefined,
  reportType: '',
  isShowedTable: false,
  isShowedTabChildren: false,
  recordTable: 0,
  selectionProcess: {},
  isContainerInfo: false,
  documentAction: [],
  openRoute: {
    path: '',
    name: '',
    route: {},
    params: {},
    definedParameters: {},
    query: {},
    isReaded: false,
    isLoaded: false
  },
  splitWidthRight: 3,
  splitWidthLeft: 3
}
