export interface IZoomWindowRouteData {
  uuid: string
  action?: any
  tabParent: string
  tabChild?: any
}
export interface IZoomWindowRoute {
    [key: string]: IZoomWindowRouteData
}

const ROUTES: IZoomWindowRoute = {
  PRINT_FORMAT_SETUP_WINDOW: {
    uuid: '8e5131dc-fb40-11e8-a479-7a0060f0aa01',
    action: undefined,
    tabParent: '0',
    tabChild: undefined
  },
  REQUEST_WINDOW: {
    uuid: '8e510176-fb40-11e8-a479-7a0060f0aa01',
    action: undefined,
    tabParent: '0',
    tabChild: undefined
  },
  WORKFLOW_WINDOW: {
    uuid: '8e5168e6-fb40-11e8-a479-7a0060f0aa01',
    action: undefined,
    tabParent: '0',
    tabChild: undefined
  },
  DOCUMENTS_WINDOW: {
    uuid: '8e50d7c8-fb40-11e8-a479-7a0060f0aa01',
    action: undefined,
    tabParent: '0',
    tabChild: undefined
  }
}

export default ROUTES
