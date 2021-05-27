import { request } from '@/ADempiere/shared/utils/request'
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

  return request({
    url: '/user-interface/window/run-callout',
    method: 'POST',
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
  }).then(response => {
    return response
  })
}
