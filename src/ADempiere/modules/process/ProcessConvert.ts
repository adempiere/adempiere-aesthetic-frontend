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
    logsList: processLogToConvert.logs_list,
    output: (!processLogToConvert.output) ? {
      description: '',
      fileName: '',
      name: '',
      output: '',
      reportType: '',
      uuid: ''
    } : convertReportOutput(processLogToConvert.output)
  }
}
