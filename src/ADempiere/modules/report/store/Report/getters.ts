import { IPrintFormatDataExtended } from '@/ADempiere/modules/dictionary'
import { RootState } from '@/ADempiere/shared/store/types'
import { ActionContext, GetterTree } from 'vuex'
import {
  IDrillTableItemData,
  IDrillTablesDataExtended,
  IReportFormatItemData,
  IReportViewDataExtended,
  IReportViewItemData,
  ReportState
} from '@/ADempiere/modules/report/ReportType'

type ReportGetterTree = GetterTree<ReportState, RootState>
type ReportActionContext = ActionContext<ReportState, RootState>

export const getters: ReportGetterTree = {
  getPrintFormatList: (state: ReportState) => (
    containerUuid: string
  ): Omit<IPrintFormatDataExtended, 'printFormatUuid'>[] => {
    const printFormatList:
            | IReportFormatItemData
            | undefined = state.reportFormatsList.find(
              (list: IReportFormatItemData) =>
                list.containerUuid === containerUuid
            )
    if (printFormatList) {
      return printFormatList.printFormatList
    }
    return []
  },
  getDefaultPrintFormat: (
    state: ReportState,
    context: ReportActionContext
  ) => (
    containerUuid: string
  ): Omit<IPrintFormatDataExtended, 'printFormatUuid'> | undefined => {
    return context.getters
      .getPrintFormatList(containerUuid)
      .find(
        (
          printFormat: Omit<
                        IPrintFormatDataExtended,
                        'printFormatUuid'
                    >
        ) => printFormat.isDefault
      )
  },
  getReportViewList: (state: ReportState) => (
    containerUuid: string
  ): IReportViewDataExtended[] => {
    const reportViewList:
            | IReportViewItemData
            | undefined = state.reportViewsList.find(
              (list: IReportViewItemData) => list.containerUuid === containerUuid
            )
    if (reportViewList) {
      return reportViewList.viewList
    }
    return []
  },
  getDrillTablesList: (state: ReportState) => (
    containerUuid: string
  ): IDrillTablesDataExtended[] => {
    const drillTablesList:
            | IDrillTableItemData
            | undefined = state.drillTablesList.find(
              (list: IDrillTableItemData) => list.containerUuid === containerUuid
            )
    if (drillTablesList) {
      return drillTablesList.drillTablesList
    }
    return []
  }
}
