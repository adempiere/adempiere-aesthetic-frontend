import { convertReportOutput } from '@/ADempiere/modules/report'
import { camelizeObjectKeys } from '@/ADempiere/shared/utils/transformObject'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { IProcessLogData } from '.'

export function convertProcessLog(processLog: any): IProcessLogData {
  const convertedProcessLog = camelizeObjectKeys(processLog) as Partial<IProcessLogData>
  convertedProcessLog.parameters = []
  convertedProcessLog.output = isEmptyValue(processLog.output) ? {} : convertReportOutput(processLog.output)
  return convertedProcessLog as IProcessLogData
}
