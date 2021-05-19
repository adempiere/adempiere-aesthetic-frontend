// Get Instance for connection
import { request } from '@/ADempiere/shared/utils/request'
import { IPrivateAccessData } from '@/ADempiere/modules/privateAccess'

// Get private access for a record
export function getPrivateAccess(data: {
    tableName: string
    recordId: number
    recordUuid: string
  }): Promise<IPrivateAccessData> {
  const { tableName, recordUuid, recordId } = data
  return request({
    url: '/ui/get-private-access',
    method: 'POST',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  })
    .then((responsePrivateAccess: any) => {
      return {
        tableName: responsePrivateAccess.table_name,
        recordId: responsePrivateAccess.record_id,
        recordUuid: responsePrivateAccess.record_uuid
      }
    })
}

// Lock a record for a user
export function lockPrivateAccess(data: {
    tableName: string
    recordId: number
    recordUuid: string
  }): Promise<IPrivateAccessData> {
  const { tableName, recordUuid, recordId } = data
  return request({
    url: '/ui/lock-private-access',
    method: 'POST',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  })
    .then((responsePrivateAccess: any) => {
      return {
        tableName: responsePrivateAccess.table_name,
        recordId: responsePrivateAccess.record_id,
        recordUuid: responsePrivateAccess.record_uuid
      }
    })
}

// Unlock a record from a user
export function unlockPrivateAccess(data: {
    tableName: string
    recordId: number
    recordUuid: string
  }): Promise<IPrivateAccessData> {
  const { tableName, recordUuid, recordId } = data
  return request({
    url: '/ui/unlock-private-access',
    method: 'POST',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  })
    .then((responsePrivateAccess: any) => {
      return {
        tableName: responsePrivateAccess.table_name,
        recordId: responsePrivateAccess.record_id,
        recordUuid: responsePrivateAccess.record_uuid
      }
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
  return request({
    url: '/ui/update-access-record',
    method: 'POST',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      token: sessionUuid
    }
  }).then(respose => {
    return respose
  })
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
  return request({
    url: '/ui/update-access-record',
    method: 'POST',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      list_rol: listRecord
    }
  })
    .then(response => {
      return response
    })
}
