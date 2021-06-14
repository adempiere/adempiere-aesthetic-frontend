import { camelizeObjectKeys, renameObjectKey } from '@/ADempiere/shared/utils/transformObject'
import {
  IRecentItemResponseData,
  IFavoriteData,
  IDashboardData,
  IPendingDocumentData
} from '.'

export function convertRecentItemsList(
  recentItemsList: any
): IRecentItemResponseData {
  const convertedList = camelizeObjectKeys(recentItemsList)
  convertedList.recentItemsList = recentItemsList.records.map((item: any) => camelizeObjectKeys(item))
  delete convertedList.records
  return convertedList as IRecentItemResponseData
}

export function convertFavorite(favorite: any): IFavoriteData {
  return camelizeObjectKeys(favorite) as IFavoriteData
}

export function convertDashboard(dashboard: any): IDashboardData {
  return camelizeObjectKeys(dashboard) as IDashboardData
}

export function convertPendingDocument(
  pendingDocument: any
): IPendingDocumentData {
  const convertedDocument = camelizeObjectKeys(pendingDocument)
  convertedDocument.criteria = camelizeObjectKeys(pendingDocument.criteria)
  renameObjectKey(convertedDocument.criteria, 'values', 'valuesList')
  renameObjectKey(convertedDocument.criteria, 'orderByColumns', 'orderByColumnList')
  return convertedDocument as IPendingDocumentData
}
