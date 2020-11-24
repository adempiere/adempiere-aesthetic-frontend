import { ISessionData, IRoleData, IMenuData } from '.'

export function convertSession(sessionToConvert: any): ISessionData {
  return {
    id: sessionToConvert.id,
    uuid: sessionToConvert.uuid,
    name: sessionToConvert.name,
    userInfo: sessionToConvert.user_info,
    role: convertRole(sessionToConvert.role),
    processed: sessionToConvert.processed,
    defaultContext: sessionToConvert.default_context,
    // system info
    countryId: sessionToConvert.country_id,
    costingPrecision: sessionToConvert.costing_precision,
    countryCode: sessionToConvert.country_code,
    countryName: sessionToConvert.country_name,
    currencyIsoCode: sessionToConvert.currency_iso_code,
    currencyName: sessionToConvert.currency_name,
    currencySymbol: sessionToConvert.currency_symbol,
    displaySequence: sessionToConvert.display_sequence,
    language: sessionToConvert.language,
    standardPrecision: sessionToConvert.standard_precision
  }
}

export function convertRole(roleToConvert: any): IRoleData {
  const { id, uuid, name, description } = roleToConvert

  return {
    id,
    uuid,
    name,
    description,
    clientId: roleToConvert.client_id,
    clientName: roleToConvert.client_name,
    isCanExport: roleToConvert.is_can_export,
    isCanReport: roleToConvert.is_can_report,
    isPersonalAccess: roleToConvert.is_personal_access,
    isPersonalLock: roleToConvert.is_personal_lock
  }
}

export const convertMenu = (data: any): IMenuData => {
  const { id, uuid, name, description, action, childs, sequence } = data
  return {
    id,
    uuid,
    parentUuid: data.parent_uuid,
    name,
    description,
    sequence,
    isReadOnly: data.is_read_only,
    isSummary: data.is_summary,
    isSalesTransaction: data.is_sales_transaction,
    action,
    referenceUuid: data.reference_uuid,
    childs,
    isActive: data.is_active
  }
}
