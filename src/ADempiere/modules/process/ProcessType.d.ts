import { IValueData } from "@/ADempiere/modules/core";
import { IReportOutputData } from "@/ADempiere/modules/report";

export interface IProcessLogData {
  uuid: string;
  instanceUuid: string;
  isError: boolean;
  summary: string;
  resultTableName: string;
  isProcessing: boolean;
  lastRun: number;
  parametersList?: any;
  parameters?: IValueData[];
  output: IReportOutputData;
}

type ParameterData = {
  key: string;
  value: any;
};

export interface IProcessRequestData {
  process_uuid: string;
  table_name: string;
  id: number;
  uuid: string;
  is_summary: boolean;
  report_type: string;
  table_selected_id: number;
  report_view_uuid: string;
  parameters: ParameterData[];
  selections: any[];
  print_format_uuid: string;
}

export interface IProcessListData {
  instanceUuid: string;
  userUuid: string;
  tableName: string;
  recordId: number;
  recordUuid: string;
  pageSize: number;
  pageToken: string;
}

export interface IProcessLogListData {
  recordCount: number;
  processLogsList: IProcessLogData[];
  nextPageToken: string;
}
