import { IRootState } from '@/store'
import {
  ActionContextName,
  ActionContextType,
  PanelContextType,
  PrintFormatOptions,
  ReportExportContextType
} from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import {
  showNotification,
  ShowNotificationOptions
} from '@/ADempiere/shared/utils/notifications'
import { IResponseList, Namespaces } from '@/ADempiere/shared/utils/types'
import { ActionContext, ActionTree } from 'vuex'
import {
  DrillTableAction,
  IPanelDataExtended,
  IPrintFormatChild,
  IPrintFormatDataExtended,
  IProcessData,
  ITabDataExtended,
  PrintFormatsAction,
  ProcessDefinitionAction,
  SummaryAction
} from '@/ADempiere/modules/dictionary'
import {
  IRecordSelectionData,
  KeyValueData
} from '@/ADempiere/modules/persistence/PersistenceType'
import {
  IContextActionData,
  IContextMenuData
} from '@/ADempiere/modules/window'
import {
  INotificationProcessData,
  IProcessInfoLogData,
  IProcessLogData,
  IProcessLogDataExtended,
  IProcessLogListData,
  ProcessState
} from '@/ADempiere/modules/process/ProcessType'
import language from '@/lang'
import { IFieldDataExtendedUtils } from '@/ADempiere/shared/utils/DictionaryUtils/type'
import { IPanelParameters } from '@/ADempiere/shared/store/modules/panel/type'
import { getToken } from '@/utils/cookies'
import {
  requestListProcessesLogs,
  requestRunProcess
} from '@/ADempiere/modules/process/ProcessService'
import {
  IDrillTablesDataExtended,
  IReportOutputData,
  IReportViewDataExtended
} from '@/ADempiere/modules/report'
import { Route } from 'vue-router'
import { ISelectionProcessData } from '@/ADempiere/shared/store/modules/Utils/type'

type ProcessActionContext = ActionContext<ProcessState, IRootState>
type ProcessActionTree = ActionTree<ProcessState, IRootState>

export const actions: ProcessActionTree = {
  processActionPerformed(
    context: ProcessActionContext,
    payload: {
            containerUuid: string
            field: any
            value: any
        }
  ) {
    return null
  },
  // Supported Actions for it
  startProcess(
    context: ProcessActionContext,
    payload: {
            parentUuid: string
            containerUuid: string
            panelType: PanelContextType
            action: IPrintFormatChild
            parametersList?: IPanelParameters[] // = [],
            reportFormat: any
            isProcessTableSelection: boolean
            isActionDocument: boolean
            tableNameUuidSelection: string
            recordUuidSelection: string
            menuParentUuid: string
            routeToDelete?: Route
        }
  ) {
    const {
      panelType,
      containerUuid,
      action,
      parentUuid,
      isProcessTableSelection,
      isActionDocument,
      tableNameUuidSelection,
      recordUuidSelection,
      menuParentUuid,
      reportFormat,
      routeToDelete
    } = payload
    let { parametersList } = payload
    return new Promise((resolve, reject) => {
      // TODO: Add support to evaluate parameters list to send
      // const samePocessInExecution = getters.getInExecution(containerUuid)
      // exists some call to executed process with container uuid
      // if (samePocessInExecution && !isProcessTableSelection) {
      //   return reject({
      //     error: 0,
      //     message: `In this process (${samePocessInExecution.name}) there is already an execution in progress.`
      //   })
      // }

      // additional attributes to send server, selection to browser, or table name and record id to window
      let selection = []
      let allData: IRecordSelectionData | undefined
      let tab: ITabDataExtended, tableName: string, recordId: string
      if (panelType) {
        if (panelType === PanelContextType.Browser) {
          allData = <IRecordSelectionData>(
                        context.rootGetters[Namespaces.BusinessData + '/' + 'getDataRecordAndSelection'](containerUuid)
                    )
          selection = context.rootGetters[Namespaces.BusinessData + '/' + 'getSelectionToServer']({
            containerUuid,
            selection: allData.selection
          })
          if (selection.length < 1) {
            showNotification({
              title: language
                .t('data.selectionRequired')
                .toString(),
              message: '',
              type: 'warning'
            })
            return reject(
              new Error(
                                // error: 0,
                                `Required selection data record to run this process (${action.name})`
              )
            )
          }
        } else if (panelType === PanelContextType.Window) {
          // const contextMenu: number = context.getters.getRecordUuidMenu()
          // TODO: Check types comming from the getter.GetRecordUuidMenu()
          const contextMenu: {
                        processTable?: any
                        tableName: string
                        valueRecord?: any
                    } = context.rootGetters[Namespaces.Utils + '/' + 'getRecordUuidMenu']()
          tab = <ITabDataExtended>(
                        context.rootGetters[Namespaces.WindowDefinition + '/' + 'getTab'](parentUuid, containerUuid)
                    )
          if (isProcessTableSelection) {
            tableName = tableNameUuidSelection
            recordId = recordUuidSelection
          } else {
            if (contextMenu.processTable) {
              tableName = contextMenu.tableName
              recordId = contextMenu.valueRecord
            } else {
              tableName = tab.tableName
              const field = <IFieldDataExtendedUtils>(
                                context.rootGetters[Namespaces.Panel + '/' + 'getFieldFromColumnName']({
                                  containerUuid,
                                  columnName: `${tableName}_ID`
                                })
                            )
              recordId = field.value!.toString()
            }
          }
        }
      }
      // get info metadata process
      const processDefinition: IProcessData = isActionDocument
        ? action
        : context.rootGetters.getProcess(action.uuid)
      let reportType: any = reportFormat

      if (!parametersList) {
        parametersList = <IPanelParameters[]>(
                    context.rootGetters[Namespaces.Panel + '/' + 'getParametersToServer']({
                      containerUuid: processDefinition.uuid
                    })
                )
      }

      const isSession = !!getToken()
      let procesingMessage: any = {
        close: () => false
      }
      if (isSession) {
        procesingMessage = showNotification({
          title: language.t('notifications.processing').toString(),
          message: processDefinition.name,
          summary: processDefinition.description,
          type: 'info'
        })
      }
      const timeInitialized: number = new Date().getTime()
      const processLog: Partial<IProcessLogDataExtended> & {
                menuParentUuid?: string
            } = {
              // panel attributes from where it was executed
              parentUuid,
              containerUuid,
              panelType,
              lastRun: timeInitialized,
              parameters: parametersList.map((element: IPanelParameters) => {
                return {
                  key: element.columnName,
                  value: element.value
                }
              }),
              logs: [],
              isError: false,
              isProcessing: true,
              summary: '',
              resultTableName: '',
              output: {
                uuid: '',
                name: '',
                description: '',
                fileName: '',
                output: '',
                outputStream: '',
                reportType: ''
              }
            }
      let processResult: INotificationProcessData
      if (isActionDocument) {
        processResult = {
          ...processLog,
          processUuid: action.uuid,
          processId: action.id,
          processName: 'Procesar Orden',
          parameters: parametersList.map((item: IPanelParameters) => {
            const itemParam: KeyValueData = {
              key: item.columnName,
              value: item.value
            }
            return itemParam
          })
        }
      } else {
        // Run process on server and wait for it for notify
        // uuid of process
        processResult = {
          ...processLog,
          menuParentUuid,
          processIdPath: routeToDelete!.path,
          printFormatUuid: action.printFormatUuid,
          // process attributes
          action: <ActionContextName>processDefinition.name,
          name: processDefinition.name,
          description: processDefinition.description,
          instanceUuid: '',
          processUuid: processDefinition.uuid,
          processId: processDefinition.id,
          processName: processDefinition.processName!,
          parameters: parametersList.map((item: IPanelParameters) => {
            const itemParam: KeyValueData = {
              key: item.columnName,
              value: item.value
            }
            return itemParam
          }),
          isReport: processDefinition.isReport
        }
      }
      context.commit('addInExecution', processResult)
      if (panelType === PanelContextType.Window) {
        reportType = ReportExportContextType.Pdf
      } else if (panelType === PanelContextType.Browser) {
        if (allData!.record.length <= 100) {
          // close view if is browser.
          context.rootState.router.push(
            { path: '/dashboard' }
          )
          // router.push(
          //     {
          //         path: '/dashboard'
          //     },
          //     () => {}
          // )
          context.dispatch('tagsView/delView', routeToDelete)
          // delete data associate to browser
          context.dispatch(Namespaces.Browser + '/' + 'deleteRecordContainer', {
            viewUuid: containerUuid
          })
        }
      } else {
        // close view if is process, report.
        context.rootState.router.push({ path: '/dashboard' })
        // router.push(
        //     {
        //         path: '/dashboard'
        //     },
        //     () => {}
        // )
        context.dispatch('tagsView/delView', routeToDelete)

        // reset panel and set defalt isShowedFromUser
        if (!processDefinition.isReport) {
          context.dispatch(Namespaces.Panel + '/' + 'setDefaultValues', {
            containerUuid,
            panelType
          }, { root: true })
        }
      }
      if (isProcessTableSelection) {
        const windowSelectionProcess: ISelectionProcessData = context.rootGetters[Namespaces.Utils + '/' + 'getProcessSelect']()
        windowSelectionProcess.selection.forEach((selection: any) => {
          Object.assign(processResult, {
            selection: selection.UUID,
            record: selection[windowSelectionProcess.tableName]
          })
          const countRequest: number = context.state.totalRequest + 1
          context.commit('setTotalRequest', countRequest)
          if (!windowSelectionProcess.finish) {
            requestRunProcess({
              uuid: processDefinition.uuid,
              id: processDefinition.id,
              reportType,
              parameters: parametersList!.map(
                (item: IPanelParameters) => {
                  const itemParam: KeyValueData = {
                    key: item.columnName,
                    value: item.value
                  }
                  return itemParam
                }
              ),
              // selectionsList: selection,
              selections: selection,
              tableName: windowSelectionProcess.tableName,
              recordId: <number>(
                                selection[windowSelectionProcess.tableName]
                            )
            })
              .then((runProcessResponse: IProcessLogData) => {
                const {
                  instanceUuid,
                  output
                } = runProcessResponse
                let logList: IProcessInfoLogData[] = []
                if (runProcessResponse.logsList) {
                  logList = runProcessResponse.logsList
                }

                let link: Partial<HTMLAnchorElement> = {
                  href: undefined,
                  download: undefined
                }
                if (processDefinition.isReport) {
                  const blob = new Blob(
                    [output.outputStream],
                    { type: output.mimeType }
                  )
                  link = document.createElement('a')
                  link.href = window.URL.createObjectURL(blob)
                  link.download = output.fileName
                  if (
                    reportType !==
                                            ReportExportContextType.Pdf &&
                                        reportType !==
                                            ReportExportContextType.Html
                  ) {
                    if (link) {
                                            link.click!()
                    }
                  }

                  // Report views List to context menu
                  const reportViewList: Partial<SummaryAction> = {
                    name: language
                      .t('views.reportView')
                      .toString(),
                    type: ActionContextType.Summary,
                    action: ActionContextName.Empty,
                    childs: [],
                    option: PrintFormatOptions.ReportView
                  }

                  reportViewList.childs = <IReportViewDataExtended[]>context.rootGetters[Namespaces.Report + '/' + 'getReportViewList'](
                    processResult.processUuid
                  )
                  if (
                    reportViewList &&
                                        !reportViewList.childs
                  ) {
                    context
                      .dispatch(
                        Namespaces.Report + '/' + 'getReportViewsFromServer',
                        {
                          processUuid: processResult.processUuid,
                          instanceUuid,
                          processId: processDefinition.id,
                          tableName: output.tableName,
                          printFormatUuid: output.printFormatUuid,
                          reportViewUuid: output.reportViewUuid // TODO: Change to uuid
                        }, { root: true }
                      )
                      .then(
                        (
                          responseReportView: IReportViewDataExtended[]
                        ) => {
                          reportViewList.childs = responseReportView
                          if (
                            reportViewList.childs
                              .length
                          ) {
                            // Get contextMenu metadata and concat print report views with contextMenu actions
                            const contextMenuMetadata: IContextMenuData = context.rootGetters[Namespaces.ContextMenu + '/' + 'getContextMenu'](
                              processResult.processUuid
                            )

                            const reportViewListActions: SummaryAction = <
                                                            SummaryAction
                                                        >reportViewList
                            contextMenuMetadata.actions.push(
                              reportViewListActions
                            )
                          }
                        }
                      )
                  }

                  // Print formats to context menu
                  const printFormatList: Partial<PrintFormatsAction> = {
                    name: language.t('views.printFormat'),
                    type: ActionContextType.Summary,
                    action: ActionContextName.Empty,
                    childs: [],
                    option: PrintFormatOptions.PrintFormat
                  }
                  printFormatList.childs =
                  <Omit<IPrintFormatDataExtended, 'printFormatUuid'>[]>context.rootGetters[Namespaces.Report + '/' + 'getPrintFormatList'](
                    processResult.processUuid
                  )
                  if (
                    printFormatList && !printFormatList.childs.length
                  ) {
                    context
                      .dispatch(Namespaces.Report + '/' + 'getListPrintFormats', {
                        processUuid: processResult.processUuid,
                        instanceUuid,
                        processId: processDefinition.id,
                        tableName: output.tableName,
                        printFormatUuid: output.printFormatUuid,
                        reportViewUuid: output.reportViewUuid
                      }, { root: true })
                      .then(
                        (
                          printFormarResponse: Omit<IPrintFormatDataExtended, 'printFormatUuid'>[]
                        ) => {
                          printFormatList.childs = printFormarResponse
                          if (
                            printFormatList.childs
                              .length
                          ) {
                            // Get contextMenu metadata and concat print Format List with contextMenu actions
                            const contextMenuMetadata: IContextMenuData = context.rootGetters[Namespaces.ContextMenu + '/' + 'getContextMenu'](
                              processResult.processUuid
                            )

                            const printFormatListActions: PrintFormatsAction =
                            <PrintFormatsAction>printFormatList
                            contextMenuMetadata.actions.push(
                              printFormatListActions
                            )
                          }
                        }
                      )
                  }

                  // Drill Tables to context menu
                  const drillTablesList: Partial<DrillTableAction> = {
                    name: language.t('views.drillTable'),
                    type: ActionContextType.Summary,
                    action: ActionContextName.Empty,
                    childs: [],
                    option: PrintFormatOptions.DrillTable
                  }
                  if (output.tableName) {
                    drillTablesList.childs =
                    <IDrillTablesDataExtended[]>context.rootGetters[Namespaces.Report + '/' + 'getDrillTablesList'](processResult.processUuid)
                    if (
                      drillTablesList &&
                                            !drillTablesList.childs
                    ) {
                      context
                        .dispatch(
                          Namespaces.Report + '/' + 'getDrillTablesFromServer',
                          {
                            processUuid: processResult.processUuid,
                            instanceUuid,
                            processId: processDefinition.id,
                            tableName: output.tableName,
                            printFormatUuid: output.printFormatUuid,
                            reportViewUuid: output.reportViewUuid
                          }, { root: true }
                        )
                        .then(
                          (
                            drillTablesResponse: IDrillTablesDataExtended[]
                          ) => {
                            drillTablesList.childs = drillTablesResponse
                            if (
                              drillTablesList
                                .childs.length
                            ) {
                              // Get contextMenu metadata and concat drill tables list with contextMenu actions
                              const contextMenuMetadata: IContextMenuData = context.rootGetters[Namespaces.ContextMenu + '/' + 'getContextMenu'](
                                processResult.processUuid
                              )

                              const drillTablesListActions: DrillTableAction = <
                                                                DrillTableAction
                                                            >drillTablesList
                              contextMenuMetadata.actions.push(
                                drillTablesListActions
                              )
                            }
                          }
                        )
                    }
                  }
                }
                // assign new attributes
                Object.assign(processResult, {
                  ...runProcessResponse,
                  url: link.href,
                  download: link.download,
                  logs: logList,
                  output
                })
                if (processResult.output) {
                  context.dispatch(
                    Namespaces.Utils + '/' + 'setReportTypeToShareLink',
                    processResult.output.reportType
                  )
                }
                context.commit(
                  'addNotificationProcess',
                  processResult
                )
                resolve(processResult)
              })
              .catch(error => {
                Object.assign(processResult, {
                  isError: true,
                  message: error.message,
                  isProcessing: false
                })
                console.warn(
                                    `Error running the process ${error}`
                )
                reject(error)
              })
              .finally(() => {
                if (processResult.isError) {
                  const countError: number =
                                        context.state.errorSelection + 1
                  context.commit(
                    'setErrorSelection',
                    countError
                  )
                } else {
                  const countSuccess: number =
                                        context.state.successSelection + 1
                  context.commit(
                    'setSuccessSelection',
                    countSuccess
                  )
                }
                const countResponse: number =
                                    context.state.totalResponse + 1
                context.commit(
                  'setTotalResponse',
                  countResponse
                )
                if (
                  context.state.totalResponse ===
                                    context.state.totalRequest
                ) {
                  if (isSession) {
                    const message = `
                          ${language.t('notifications.totalProcess')}
                          ${countResponse}
                          ${language.t('notifications.error')}
                          ${context.state.errorSelection}
                          ${language.t('notifications.succesful')}
                          ${context.state.successSelection}
                          ${language.t('notifications.processExecuted')}
                        `
                    showNotification({
                      title: language
                        .t('notifications.succesful')
                        .toString(),
                      message,
                      type: 'success'
                    })
                  }

                  context.commit('setTotalRequest', 0)
                  context.commit('setTotalResponse', 0)
                  context.commit('setSuccessSelection', 0)
                  context.commit('setErrorSelection', 0)
                }
                context.dispatch('setProcessSelect', {
                  selection: 0,
                  finish: true,
                  tableName: ''
                })
                context.commit(
                  'addNotificationProcess',
                  processResult
                )
                context.commit(
                  'addStartedProcess',
                  processResult
                )
                context.commit('deleteInExecution', {
                  containerUuid
                })
              })
          }
        })
      } else {
        requestRunProcess({
          uuid: processDefinition.uuid,
          id: processDefinition.id,
          reportType,
          // parametersList,
          parameters: parametersList.map(
            (element: IPanelParameters) => {
              return {
                key: element.columnName,
                value: element.value
              }
            }
          ),
          selections: selection,
          tableName: tableName!,
          recordId: Number(recordId!)
        })
          .then((runProcessResponse: IProcessLogData) => {
            const { instanceUuid, output } = runProcessResponse
            let logList: IProcessInfoLogData[] = []
            if (runProcessResponse.logsList) {
              logList = runProcessResponse.logsList
            }

            let link: Partial<HTMLAnchorElement> = {
              href: undefined,
              download: undefined
            }
            if (
              runProcessResponse.isReport ||
                            processDefinition.isReport
            ) {
              const blob = new Blob([output.outputStream], {
                type: output.mimeType
              })
              link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
              link.download = output.fileName
              if (reportType !== 'pdf' && reportType !== 'html') {
                                link.click!()
              }
              const contextMenuMetadata: IContextMenuData = <IContextMenuData>
              context.rootGetters[Namespaces.ContextMenu + '/' + 'getContextMenu'](
                processResult.processUuid
              )
              // Report views List to context menu
              const reportViewList: Partial<SummaryAction> = {
                name: language.t('views.reportView'),
                type: ActionContextType.Summary,
                action: ActionContextName.Empty,
                childs: [],
                option: PrintFormatOptions.ReportView
              }
              reportViewList.childs = <IReportViewDataExtended[]>(
                                context.rootGetters[Namespaces.Report + '/' + 'getReportViewList'](
                                  processResult.processUuid
                                )
                            )
              if (
                reportViewList &&
                                !reportViewList.childs.length
              ) {
                context
                  .dispatch(Namespaces.Report + '/' + 'getReportViewsFromServer', {
                    processUuid: processResult.processUuid,
                    instanceUuid,
                    processId: processDefinition.id,
                    tableName: output.tableName,
                    printFormatUuid: output.printFormatUuid,
                    reportViewUuid: output.reportViewUuid
                  }, { root: true })
                  .then(
                    (
                      responseReportView: IReportViewDataExtended[]
                    ) => {
                      reportViewList.childs = responseReportView
                      if (reportViewList.childs!.length) {
                        const reportViewListActions: SummaryAction = <SummaryAction>reportViewList
                        // Get contextMenu metadata and concat print report views with contextMenu actions
                        contextMenuMetadata.actions.push(
                          reportViewListActions
                        )
                      }
                    }
                  )
              }

              // Print formats to context menu
              const printFormatList: Partial<PrintFormatsAction> = {
                name: language.t('views.printFormat'),
                type: ActionContextType.Summary,
                action: ActionContextName.Empty,
                childs: [],
                option: PrintFormatOptions.PrintFormat
              }
              printFormatList.childs = <Omit<IPrintFormatDataExtended, 'printFormatUuid'>[]>
                                context.rootGetters[Namespaces.Report + '/' + 'getPrintFormatList'](
                                  processResult.processUuid
                                )
              if (
                printFormatList &&
                                !printFormatList.childs.length
              ) {
                context
                  .dispatch(Namespaces.Report + '/' + 'getListPrintFormats', {
                    processUuid: processResult.processUuid,
                    instanceUuid,
                    processId: processDefinition.id,
                    tableName: output.tableName,
                    printFormatUuid: output.printFormatUuid,
                    reportViewUuid: output.reportViewUuid
                  }, { root: true })
                  .then(
                    (
                      printFormarResponse: Omit<IPrintFormatDataExtended, 'printFormatUuid'>[]
                    ) => {
                      printFormatList.childs = printFormarResponse
                      if (printFormatList.childs.length) {
                        // Get contextMenu metadata and concat print Format List with contextMenu actions
                        const printFormatListActions: PrintFormatsAction = <PrintFormatsAction>printFormatList
                        contextMenuMetadata.actions.push(
                          printFormatListActions
                        )
                      }
                    }
                  )
              } else {
                const index: number = contextMenuMetadata.actions.findIndex(
                  (action: IContextActionData) => {
                    const printFormatActionItem = action as PrintFormatsAction
                    return (
                      printFormatActionItem.option === PrintFormatOptions.PrintFormat
                    )
                  }
                )
                if (index !== -1) {
                  const printFormatListActions = <
                                        PrintFormatsAction
                                    >printFormatList
                  contextMenuMetadata.actions[
                    index
                  ] = printFormatListActions
                }
              }

              // Drill Tables to context menu
              const drillTablesList: Partial<DrillTableAction> = {
                name: language.t('views.drillTable'),
                type: ActionContextType.Summary, //  'summary',
                action: ActionContextName.Empty,
                childs: [],
                option: PrintFormatOptions.DrillTable //  'drillTable'
              }
              if (output.tableName) {
                drillTablesList.childs = context.rootGetters[Namespaces.Report + '/' + 'getDrillTablesList'](
                  processResult.processUuid
                )
                if (
                  drillTablesList &&
                                    !drillTablesList.childs
                ) {
                  context
                    .dispatch(Namespaces.Report + '/' + 'getDrillTablesFromServer', {
                      processUuid: processResult.processUuid,
                      instanceUuid,
                      processId: processDefinition.id,
                      tableName: output.tableName,
                      printFormatUuid: output.printFormatUuid,
                      reportViewUuid: output.reportViewUuid
                    })
                    .then(drillTablesResponse => {
                      drillTablesList.childs = drillTablesResponse
                      if (drillTablesList.childs!.length
                      ) {
                        // Get contextMenu metadata and concat print Format List with contextMenu actions
                        const drillTableListActions = <DrillTableAction>drillTablesList
                        contextMenuMetadata.actions.push(
                          drillTableListActions
                        )
                      }
                    })
                }
              }
            }
            // assign new attributes
            Object.assign(processResult, {
              ...runProcessResponse,
              url: link.href,
              download: link.download,
              logs: logList,
              output
            })
            resolve(processResult)
            if (processResult.output) {
              context.dispatch(
                Namespaces.Utils + '/' + 'setReportTypeToShareLink',
                processResult.output.reportType,
                { root: true }
              )
            }
          })
          .catch(error => {
            Object.assign(processResult, {
              isError: true,
              message: error.message,
              isProcessing: false
            })
            console.warn(
                            `Error running the process ${error.message}. Code: ${error.code}.`
            )
            reject(error)
          })
          .finally(() => {
            if (!processResult.isError) {
              if (panelType === PanelContextType.Window) {
                // TODO: Add conditional to indicate when update record
                context.dispatch(
                  Namespaces.Window + '/' + 'updateRecordAfterRunProcess',
                  {
                    parentUuid,
                    containerUuid,
                    tab
                  },
                  { root: true }
                )
              } else if (panelType === PanelContextType.Browser) {
                if (allData!.record.length >= 100) {
                  context.dispatch(Namespaces.Browser + '/' + 'getBrowserSearch', {
                    containerUuid
                  }, { root: true })
                }
              }
            }

            context.commit('addNotificationProcess', processResult)
            context.dispatch('finishProcess', {
              processOutput: processResult,
              procesingMessage,
              routeToDelete
            })

            context.commit('deleteInExecution', {
              containerUuid
            })

            context.dispatch('setProcessTable', {
              valueRecord: 0,
              tableName: '',
              processTable: false
            })
            context.dispatch('setProcessSelect', {
              finish: true
            })
          })
      }
    })
  },
  // Supported to process selection
  selectionProcess(
    context: ProcessActionContext,
    payload: {
            parentUuid: string
            containerUuid: string
            panelType: PanelContextType
            action: ProcessDefinitionAction
            isProcessTableSelection: boolean
            parametersList?: any[]
            menuParentUuid: string
            routeToDelete: Route
        }
  ) {
    const {
      parentUuid,
      containerUuid,
      panelType,
      action,
      isProcessTableSelection,
      menuParentUuid,
      routeToDelete
    } = payload
    let { parametersList = payload.parametersList || [] } = payload
    // get info metadata process
    const processDefinition:
            | IProcessData
            | undefined = context.rootGetters.getProcess(action.uuid)
    const reportType: ReportExportContextType = ReportExportContextType.Pdf
    if (!parametersList) {
      parametersList = <IPanelParameters[]>(
                context.rootGetters[Namespaces.Panel + '/' + 'getParametersToServer']({
                  containerUuid: processDefinition!.uuid
                })
            )
    }
    const isSession = !!getToken()
    if (isSession) {
      showNotification({
        title: language.t('notifications.processing').toString(),
        message: processDefinition!.name,
        summary: processDefinition!.description,
        type: 'info'
      })
    }
    const timeInitialized: number = new Date().getTime()
    // Run process on server and wait for it for notify
    if (isProcessTableSelection) {
      const windowSelectionProcess: Partial<ISelectionProcessData> = context.rootGetters[Namespaces.Utils + '/' + 'getProcessSelect']()
            windowSelectionProcess.selection!.forEach(selection => {
              const processResult: INotificationProcessData = {
                // panel attributes from where it was executed
                parentUuid,
                containerUuid,
                panelType,
                menuParentUuid,
                processIdPath: routeToDelete.path,
                // process attributes
                lastRun: timeInitialized,
                action: <ActionContextName>processDefinition!.name,
                name: processDefinition!.name,
                description: processDefinition!.description,
                instanceUuid: '',
                processUuid: processDefinition!.uuid,
                processId: processDefinition!.id,
                processName: processDefinition!.processName,
                parameters: parametersList,
                isError: false,
                isProcessing: true,
                isReport: processDefinition!.isReport,
                summary: '',
                resultTableName: '',
                logs: [],
                selection: selection.UUID,
                record: selection[windowSelectionProcess.tableName!],
                output: {
                  uuid: '',
                  name: '',
                  description: '',
                  fileName: '',
                  output: '',
                  outputStream: '',
                  reportType: ''
                }
              }
              const countRequest: number = context.state.totalRequest + 1
              context.commit('addInExecution', processResult)
              context.commit('setTotalRequest', countRequest)
              if (!windowSelectionProcess.finish) {
                return requestRunProcess({
                  uuid: processDefinition!.uuid,
                  id: processDefinition!.id,
                  reportType,
                  parameters: parametersList,
                  selections: selection,
                  tableName: windowSelectionProcess.tableName!,
                  recordId: selection[windowSelectionProcess.tableName!]
                })
                  .then((response: IProcessLogData) => {
                    let output = {
                      uuid: '',
                      name: '',
                      description: '',
                      fileName: '',
                      mimeType: '',
                      output: '',
                      outputStream: '',
                      reportType: ''
                    }
                    if (!response.output) {
                      const responseOutput: IReportOutputData =
                                    response.output
                      output = {
                        uuid: responseOutput.uuid,
                        name: responseOutput.name,
                        description: responseOutput.description,
                        fileName: responseOutput.fileName,
                        mimeType: responseOutput.mimeType!,
                        output: responseOutput.output,
                        outputStream: responseOutput.outputStream,
                        reportType: responseOutput.reportType
                      }
                    }
                    let logList: any[] = []
                    if (response.logsList) {
                      logList = response.logsList.map(
                        (itemLog: IProcessInfoLogData) => {
                          return {
                            log: itemLog.log,
                            recordId: itemLog.recordId
                          }
                        }
                      )
                    }

                    // assign new attributes
                    Object.assign(processResult, {
                      instanceUuid: response.instanceUuid,
                      isError: response.isError,
                      isProcessing: response.isProcessing,
                      summary: response.summary,
                      ResultTableName: response.resultTableName,
                      lastRun: response.lastRun,
                      logs: logList,
                      output
                    })
                    if (processResult.output) {
                      context.dispatch(Namespaces.Utils + '/' + 'setReportTypeToShareLink',
                        processResult.output.reportType
                      )
                    }
                    if (processResult.isError) {
                      const countError: number =
                                    context.state.errorSelection + 1
                      context.commit('setErrorSelection', countError)
                    } else {
                      const countSuccess: number =
                                    context.state.successSelection + 1
                      context.commit(
                        'setSuccessSelection',
                        countSuccess
                      )
                    }
                    const countResponse: number =
                                context.state.totalResponse + 1
                    context.commit('setTotalResponse', countResponse)
                    if (
                      context.state.totalResponse ===
                                context.state.totalRequest
                    ) {
                      if (isSession) {
                        const message = `
                        ${language.t('notifications.totalProcess')}
                        ${countResponse}
                        ${language.t('notifications.error')}
                        ${context.state.errorSelection}
                        ${language.t('notifications.succesful')}
                        ${context.state.successSelection}
                        ${language.t('notifications.processExecuted')}
                      `
                        showNotification({
                          title: language
                            .t('notifications.succesful')
                            .toString(),
                          message,
                          type: 'success'
                        })
                      }
                      context.commit('setTotalRequest', 0)
                      context.commit('setTotalResponse', 0)
                      context.commit('setSuccessSelection', 0)
                      context.commit('setErrorSelection', 0)
                    }
                    context.dispatch('setProcessSelect', {
                      selection: 0,
                      finish: true,
                      tableName: ''
                    })
                    context.commit(
                      'addNotificationProcess',
                      processResult
                    )
                    context.commit('addStartedProcess', processResult)
                    context.commit('deleteInExecution', {
                      containerUuid
                    })
                  })
                  .catch(error => {
                    Object.assign(processResult, {
                      isError: true,
                      message: error.message,
                      isProcessing: false
                    })
                    console.warn(
                                `Error running the process. Code ${error.code}: ${error.message}.`
                    )
                  })
              }
            })
    }
  },
  /**
     * TODO: Add date time in which the process/report was executed
     */
  getSessionProcessFromServer(
    context: ProcessActionContext,
    parameters: {
            pageToken: string
            pageSize: number
        }
  ) {
    // process Activity

    const { pageToken, pageSize } = parameters
    return requestListProcessesLogs({ pageToken, pageSize })
      .then((processActivityResponse: IProcessLogListData) => {
        const responseList = processActivityResponse.processLogsList.map(
          (processLogItem: IProcessLogData) => {
            const processMetadata: IProcessData | undefined = context.rootGetters.getProcess(
              processLogItem.uuid
            )
            // if no exists metadata process in store and no request progess
            if (
              processMetadata === undefined &&
                            context.getters.getInRequestMetadata(
                              processLogItem.uuid
                            ) === undefined
            ) {
              context.commit(
                'addInRequestMetadata',
                processLogItem.uuid
              )
              context
                .dispatch(Namespaces.ProcessDefinition + '/' + 'getProcessFromServer', {
                  containerUuid: processLogItem.uuid
                }, { root: true })
                .finally(() => {
                  context.commit(
                    'deleteInRequestMetadata',
                    processLogItem.uuid
                  )
                })
            }
            const process: IProcessLogData & {
                            processUuid: string
                        } = {
                          ...processLogItem,
                          processUuid: processLogItem.uuid
                        }
            return process
          }
        )

        const processResponseList: IResponseList<IProcessLogData & {
                    processUuid: string
                }> = {
                  recordCount: processActivityResponse.recordCount,
                  list: responseList,
                  nextPageToken: processActivityResponse.nextPageToken
                }
        context.commit('setSessionProcess', processResponseList)

        return processResponseList
      })
      .catch(error => {
        showNotification({
          title: language.t('notifications.error').toString(),
          message: error.message,
          type: 'error'
        })
        console.warn(
                    `Error getting process activity: ${error.message}. Code: ${error.code}.`
        )
      })
  },
  /**
     * Show modal dialog with process/report, tab (sequence) metadata
     * @param {String} type of panel or panelType ('process', 'report', 'window')
     * @param {Object} action
     */
  setShowDialog(
    context: ProcessActionContext,
    payload: {
            type: PanelContextType
            action?: {
                panelType: PanelContextType
                containerUuid: string
                parentUuid: string
                uuid: string
            }
        }
  ) {
    const { action, type } = payload
    const panels: PanelContextType[] = [
      PanelContextType.Process,
      PanelContextType.Report,
      PanelContextType.Window
    ]
    if (
      action &&
            (panels.includes(type) || panels.includes(action.panelType!))
    ) {
      // show some process loaded in store
      if (
        context.state.metadata &&
                context.state.metadata.containerUuid &&
                context.state.metadata.containerUuid === action.containerUuid
      ) {
        context.commit('setShowDialog', true)
        return
      }
      const panel:
                | IPanelDataExtended
                | undefined = context.rootGetters[Namespaces.Panel + '/' + 'getPanel'](action.containerUuid)
      if (!panel) {
        context
          .dispatch(Namespaces.Panel + '/' + 'getPanelAndFields', {
            parentUuid: action.parentUuid,
            containerUuid: !action.uuid
              ? action.containerUuid
              : action.uuid,
            panelType: action.panelType
          })
          .then((responsePanel: any) => {
            context.commit('setMetadata', responsePanel)
            context.commit('setShowDialog', true)
          })
      } else {
        context.commit('setMetadata', panel)
        context.commit('setShowDialog', true)
      }
      return
    }
    context.commit('setShowDialog', false)
  },
  finishProcess(
    context: ProcessActionContext,
    payload: {
            processOutput: INotificationProcessData
            routeToDelete: Route
            procesingMessage?: any
        }
  ): void {
    const { processOutput, routeToDelete, procesingMessage } = payload
    const processMessage: ShowNotificationOptions = {
      name: processOutput.processName,
      title: language.t('notifications.succesful').toString(),
      message: language.t('notifications.processExecuted').toString(),
      type: 'success',
      logs: processOutput.logs,
      summary: processOutput.summary
    }
    const errorMessage: string = processOutput.message
      ? processOutput.message
      : language.t('notifications.error').toString()
    // TODO: Add isReport to type always 'success'
    if (
      processOutput.isError ||
            !processOutput.processId ||
            !processOutput.instanceUuid
    ) {
      processMessage.title = language.t('notifications.error').toString()
      processMessage.message = errorMessage
      processMessage.type = 'error'
      processOutput.isError = true
    }
    if (processOutput.isReport && !processOutput.isError) {
      // open report viewer with report response
      let menuParentUuid: string = routeToDelete.params.menuParentUuid
      if (!menuParentUuid) {
        menuParentUuid = processOutput.menuParentUuid!
      }

      let tableName = ''
      if (processOutput.option && processOutput.option) {
        if (processOutput.option === PrintFormatOptions.DrillTable) {
          tableName = processOutput.resultTableName!
        }
      }

      context.rootState.router.push(
        {
          name: 'Report Viewer',
          params: {
            processId: processOutput.processId!.toString(),
            instanceUuid: processOutput.instanceUuid!,
            fileName: (!processOutput.output?.fileName) ? processOutput.fileName! : processOutput.output.fileName,
            menuParentUuid,
            tableName
          }
        }
      )

      // router.push(
      //     {
      //         name: 'Report Viewer',
      //         params: {
      //             processId: processOutput.processId,
      //             instanceUuid: processOutput.instanceUuid,
      //             fileName: isEmptyValue(processOutput.output.fileName)
      //                 ? processOutput.fileName
      //                 : processOutput.output.fileName,
      //             menuParentUuid,
      //             tableName
      //         }
      //     },
      //     () => {}
      // )
    }
    const isSession = !!getToken()
    if (isSession) {
      showNotification(processMessage)
    }
    if (procesingMessage) {
      procesingMessage.close()
    }

    context.commit('addStartedProcess', processOutput)
    context.commit('setReportValues', processOutput)
  },
  changeFormatReport(context: ProcessActionContext, reportFormat) {
    if (reportFormat) {
      context.commit('changeFormatReport', reportFormat)
    }
  }
}
