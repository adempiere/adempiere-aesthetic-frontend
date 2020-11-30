import { convertReportOutput } from '@/ADempiere/modules/report'
import { IProcessLogData } from '.'

export function convertProcessLog(processLogToConvert: any): IProcessLogData {
  return {
    uuid: processLogToConvert.uuid,
    instanceUuid: processLogToConvert.instance_uuid,
    isError: processLogToConvert.is_error,
    summary: processLogToConvert.summary,
    resultTableName: processLogToConvert.result_table_name,
    isProcessing: processLogToConvert.is_processing,
    lastRun: processLogToConvert.last_run,
    // parametersList: processLogToConvert.parameter.map(parameter => {
    //   return convertEntity(parameter)
    // }),
    parameters: [],
    output: convertReportOutput(processLogToConvert.output)
  }
}
