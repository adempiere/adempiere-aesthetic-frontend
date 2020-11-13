import { IValueData } from "../core/types.js";
import { IReportOutputData } from "../report/types";

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
