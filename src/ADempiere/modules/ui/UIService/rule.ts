import {
  ApiRest as requestRest,
  evaluateResponse
} from '@/ADempiere/shared/services/instances'
import { ICallOutData, ICallOutParams } from '../UITypes'

export function runCallOutRequest(data: ICallOutParams): Promise<ICallOutData> {
  data.attributesList = data.attributesList ? [] : data.attributesList
  const {
    windowUuid,
    windowNo,
    tabUuid,
    tableName,
    columnName,
    value,
    oldValue,
    callout,
    attributesList
  } = data

  return requestRest({
    url: '/ui/run-callout',
    data: {
      table_name: tableName,
      window_uuid: windowUuid,
      tab_uuid: tabUuid,
      callout,
      column_name: columnName,
      old_value: oldValue,
      value,
      window_no: windowNo,
      attributes: attributesList
    }
  }).then(evaluateResponse)
}
