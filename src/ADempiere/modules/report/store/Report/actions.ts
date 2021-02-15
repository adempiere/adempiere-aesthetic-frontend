import { IPrintFormatDataExtended } from '@/ADempiere/modules/dictionary'
import { IPanelParameters } from '@/ADempiere/shared/store/modules/panel/type'
import { IRootState } from '@/store'
import {
  ActionContextType,
  PrintFormatOptions
} from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { ActionTree, ActionContext } from 'vuex'
import {
  requestGetReportOutput,
  requestListDrillTables,
  requestListPrintFormats,
  requestListReportsViews
} from '@/ADempiere/modules/report/ReportService'
import {
  IDrillTablesData,
  IDrillTablesDataExtended,
  IListPrintsFormatsData,
  IPrintFormatData,
  IReportDrillTableResponse,
  IReportOutputData,
  IReportOutputDataExtended,
  IReportsViewResponse,
  IReportViewData,
  IReportViewDataExtended,
  ReportState
} from '@/ADempiere/modules/report/ReportType'
import { Namespaces } from '@/ADempiere/shared/utils/types'

type ReportActionTree = ActionTree<ReportState, IRootState>
type ReportActionContext = ActionContext<ReportState, IRootState>

export const actions: ReportActionTree = {
  reportActionPerformed(
    context: ReportActionContext,
    payload: {
            containerUuid: string
            field: any
            value: any
        }
  ) {
    return null
  },
  getListPrintFormats(
    context: ReportActionContext,
    payload: {
            processId: number
            processUuid: string
            instanceUuid: string
        }
  ): Promise<Omit<
  IPrintFormatDataExtended,
  'printFormatUuid'
>[]> {
    const { processId, processUuid, instanceUuid } = payload
    return new Promise(resolve => {
      requestListPrintFormats({
        processUuid
      })
        .then((printFormatResponse: IListPrintsFormatsData) => {
          const printFormatList: Omit<
                        IPrintFormatDataExtended,
                        'printFormatUuid'
                    >[] = printFormatResponse.list.map(
                      (printFormatItem: IPrintFormatData) => {
                        return {
                          ...printFormatItem,
                          type: ActionContextType.UpdateReport,
                          option: PrintFormatOptions.PrintFormat,
                          instanceUuid,
                          processUuid,
                          processId
                        }
                      }
                    )
          context.commit('setReportFormatsList', {
            containerUuid: processUuid,
            printFormatList
          })

          resolve(printFormatList)
        })
        .catch(error => {
          console.warn(
                        `Error getting print formats: ${error.message}. Code: ${error.code}.`
          )
        })
    })
  },
  getReportViewsFromServer(
    context: ReportActionContext,
    payload: {
            processId: number
            processUuid: string
            instanceUuid: string
            printFormatUuid: string
            tableName: string
        }
  ): Promise<IReportViewDataExtended[]> {
    const {
      processUuid,
      processId,
      printFormatUuid,
      instanceUuid,
      tableName
    } = payload
    return new Promise(resolve => {
      requestListReportsViews({ processUuid, tableName })
        .then((reportViewResponse: IReportsViewResponse) => {
          const reportViewList: IReportViewDataExtended[] = reportViewResponse.list.map(
            (reportViewItem: IReportViewData) => {
              return {
                ...reportViewItem,
                type: ActionContextType.UpdateReport,
                option: PrintFormatOptions.ReportView,
                instanceUuid,
                printFormatUuid,
                processUuid,
                processId
              }
            }
          )
          context.commit('setReportViewsList', {
            containerUuid: processUuid,
            viewList: reportViewList
          })

          resolve(reportViewList)
        })
        .catch(error => {
          console.warn(
                        `Error getting report views: ${error.message}. Code: ${error.code}.`
          )
        })
    })
  },
  getDrillTablesFromServer(
    context: ReportActionContext,
    payload: {
            processId: number
            processUuid: string
            instanceUuid: string
            printFormatUuid: string
            tableName: string
            reportViewUuid: string
        }
  ): Promise<IDrillTablesDataExtended[]> {
    const {
      processId,
      processUuid,
      instanceUuid,
      printFormatUuid,
      tableName,
      reportViewUuid
    } = payload
    return new Promise(resolve => {
      requestListDrillTables({ tableName })
        .then((responseDrillTables: IReportDrillTableResponse) => {
          const drillTablesList: IDrillTablesDataExtended[] = responseDrillTables.list.map(
            (drillTableItem: IDrillTablesData) => {
              return {
                ...drillTableItem,
                name: drillTableItem.printName,
                type: ActionContextType.UpdateReport,
                option: PrintFormatOptions.DrillTable,
                instanceUuid,
                printFormatUuid,
                reportViewUuid,
                processUuid,
                processId
              }
            }
          )
          context.commit('setDrillTablesList', {
            containerUuid: processUuid,
            drillTablesList
          })

          resolve(drillTablesList)
        })
        .catch((error: any) => {
          console.warn(
                        `Error getting drill tables: ${error.message}. Code: ${error.code}.`
          )
        })
    })
  },
  getReportOutputFromServer(
    context: ReportActionContext,
    payload: {
            tableName: string
            printFormatUuid?: string
            reportViewUuid: string
            isSummary: boolean
            reportName: string
            reportType: ActionContextType
            processUuid: string
            processId: number
            instanceUuid: string
            option: PrintFormatOptions
        }
  ): Promise<IReportOutputDataExtended> {
    const {
      tableName,
      reportViewUuid,
      isSummary,
      reportName,
      reportType,
      processUuid,
      processId,
      instanceUuid,
      option
    } = payload
    let { printFormatUuid } = payload
    return new Promise(resolve => {
      if (!printFormatUuid) {
        printFormatUuid = context.getters.getDefaultPrintFormat(
          processUuid
        ).printFormatUuid
      }
      const parametersList: IPanelParameters[] = <IPanelParameters[]>(
                context.rootGetters[Namespaces.Panel + '/' + 'getParametersToServer']({
                  containerUuid: processUuid
                })
            )
      requestGetReportOutput({
        parametersList,
        printFormatUuid: printFormatUuid!,
        reportViewUuid,
        isSummary,
        reportName,
        reportType,
        tableName
      })
        .then((response: IReportOutputData) => {
          const reportOutput: IReportOutputDataExtended = {
            ...response,
            processId,
            processUuid,
            isError: false,
            instanceUuid,
            isReport: true,
            option
          }
          context.commit('setNewReportOutput', reportOutput)

          resolve(reportOutput)
        })
        .catch(error => {
          console.warn(
                        `Error getting report output: ${error.message}. Code: ${error.code}.`
          )
        })
    })
  }
}
