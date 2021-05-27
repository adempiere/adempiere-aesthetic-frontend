import { request } from '@/ADempiere/shared/utils/request'
import { IFavoriresFromServerParams } from '.'
import {
  convertRecentItemsList,
  convertFavorite,
  convertPendingDocument,
  convertDashboard
} from './DashboardConvert'
import {
  IFavoriresFromServerResponse,
  IListDashboardsParams,
  IListDashboardsResponse,
  IPendingDocumentsFromServerParams,
  IPendingDocumentsFromServerResponse,
  IRecentItemResponseData,
  ListRecentItemsParams
} from './DashboardType'

export function requestListRecentItems(
  data: ListRecentItemsParams
): Promise<IRecentItemResponseData> {
  const { userUuid, roleUuid, pageToken, pageSize } = data
  return request({
    url: '/dashboard/addons/user/recent-items',
    method: 'GET',
    params: {
      user_uuid: userUuid,
      role_uuid: roleUuid,
      current_session: true,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(recentItmesReponse => {
      return convertRecentItemsList(recentItmesReponse)
    })
}

export function getFavoritesFromServer(
  data: IFavoriresFromServerParams
): Promise<IFavoriresFromServerResponse> {
  const { userId, userUuid, pageToken, pageSize } = data
  return request({
    url: '/dashboard/addons/user/favorites',
    method: 'GET',
    params: {
      user_id: userId,
      user_uuid: userUuid,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(favoritesListReponse => {
      return {
        recordCount: favoritesListReponse.record_count,
        favoritesList: favoritesListReponse.records.map(
          (favorite: any) => {
            return convertFavorite(favorite)
          }
        ),
        nextPageToken: favoritesListReponse.next_page_token
      }
    })
}

// Get pending documents
export function getPendingDocumentsFromServer(
  data: IPendingDocumentsFromServerParams
): Promise<IPendingDocumentsFromServerResponse> {
  const { userId, userUuid, roleId, roleUuid, pageToken, pageSize } = data
  return request({
    url: '/dashboard/addons/tasks/pending-documents',
    method: 'POST',
    params: {
      user_id: userId,
      user_uuid: userUuid,
      role_id: roleId,
      role_uuid: roleUuid,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(pendingDocumentsListResponse => {
      return {
        recordCount: pendingDocumentsListResponse.record_count,
        pendingDocumentsList: pendingDocumentsListResponse.records.map(
          (pendingDocument: any) => {
            return convertPendingDocument(pendingDocument)
          }
        ),
        nextPageToken: pendingDocumentsListResponse.next_page_token
      }
    })
}

// List all dashboard for role
export function requestListDashboards(
  data: IListDashboardsParams
): Promise<IListDashboardsResponse> {
  const { roleId, roleUuid, pageToken, pageSize } = data
  return request({
    url: '/dashboard/dashboards',
    method: 'GET',
    params: {
      role_id: roleId,
      role_uuid: roleUuid,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(dashboardsListResponse => {
      return {
        recordCount: dashboardsListResponse.record_count,
        list: dashboardsListResponse.records.map((dashboard: any) => {
          return convertDashboard(dashboard)
        }),
        nextPageToken: dashboardsListResponse.next_page_token
      }
    })
}
