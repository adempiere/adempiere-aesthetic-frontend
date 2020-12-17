// Get Instance for connection
import {
  ApiRest as requestRest,
  evaluateResponse
} from '@/ADempiere/shared/services/instances'
import { convertPrivateAccess } from './PrivateAccessConvert'
import { IPrivateAccessData } from './PrivateAccessType'

// Get private access for a record
export function requestGetPrivateAccess(data: {
    tableName: string
    recordId: number
    recordUuid: string
  }): Promise<IPrivateAccessData> {
  const { tableName, recordUuid, recordId } = data
  return requestRest({
    url: '/ui/get-private-access',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  })
    .then(evaluateResponse)
    .then((responsePrivateAccess: any) => {
      return convertPrivateAccess(responsePrivateAccess)
    })
}

// Lock a record for a user
export function requestLockPrivateAccess(data: {
    tableName: string
    recordId: number
    recordUuid: string
  }): Promise<IPrivateAccessData> {
  const { tableName, recordUuid, recordId } = data
  return requestRest({
    url: '/ui/lock-private-access',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  })
    .then(evaluateResponse)
    .then((responsePrivateAccess: any) => {
      return convertPrivateAccess(responsePrivateAccess)
    })
}

// Unlock a record from a user
export function requestUnlockPrivateAccess(data: {
    tableName: string
    recordId: number
    recordUuid: string
  }): Promise<IPrivateAccessData> {
  const { tableName, recordUuid, recordId } = data
  return requestRest({
    url: '/ui/unlock-private-access',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  })
    .then(evaluateResponse)
    .then((responsePrivateAccess: any) => {
      return convertPrivateAccess(responsePrivateAccess)
    })
}
