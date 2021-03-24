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

/**
 * List Rol Access Record
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 * @param {string}  sessionUuid
 */
export function getAccessList(data: {
  tableName: string
  recordId: number
  recordUuid: string
  sessionUuid: string
}): Promise<any> {
  const { tableName, recordId, recordUuid, sessionUuid } = data
  return requestRest({
    url: '/ui/update-access-record',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      token: sessionUuid
    }
  })
    .then(evaluateResponse)
}

/**
 * Update Access Record
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 * @param {array}  listRol
 */
export function updateAccessRecord(data: {
  tableName: string
  recordId: number
  recordUuid: string
  listRecord: any[]
}): Promise<any> {
  const { tableName, recordUuid, recordId, listRecord } = data
  return requestRest({
    url: '/ui/update-access-record',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      list_rol: listRecord
    }
  })
    .then(evaluateResponse)
}
