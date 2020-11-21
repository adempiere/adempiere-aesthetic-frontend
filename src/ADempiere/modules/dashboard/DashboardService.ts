import {
  ApiRest as requestRest,
  evaluateResponse
} from '@/ADempiere/shared/services/instances'
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
  return requestRest({
    url: '/logs/list-recent-items',
    data: {
      user_uuid: userUuid,
      role_uuid: roleUuid,
      current_session: true
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(evaluateResponse)
    .then(recentItmesReponse => {
      return convertRecentItemsList(recentItmesReponse)
    })
}

export function getFavoritesFromServer(
  data: IFavoriresFromServerParams
): Promise<IFavoriresFromServerResponse> {
  const { userId, userUuid, pageToken, pageSize } = data
  return requestRest({
    url: '/dashboard/list-favorites',
    data: {
      user_id: userId,
      user_uuid: userUuid
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(evaluateResponse)
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
  return requestRest({
    url: '/dashboard/list-pending-documents',
    data: {
      user_id: userId,
      user_uuid: userUuid,
      role_id: roleId,
      role_uuid: roleUuid
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(evaluateResponse)
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
export function requestLisDashboards(
  data: IListDashboardsParams
): Promise<IListDashboardsResponse> {
  const { roleId, roleUuid, pageToken, pageSize } = data
  return requestRest({
    url: '/dashboard/list-dashboards',
    data: {
      role_id: roleId,
      role_uuid: roleUuid
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(evaluateResponse)
    .then(dashboardsListResponse => {
      return {
        recordCount: dashboardsListResponse.record_count,
        dashboardsList: dashboardsListResponse.records.map(
          (dashboard: any) => {
            return convertDashboard(dashboard)
          }
        ),
        nextPageToken: dashboardsListResponse.next_page_token
      }
    })
}
