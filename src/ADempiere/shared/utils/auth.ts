import Cookies from 'js-cookie'

const roleKey = 'roleUuid'
export const setCurrentRole = (currentRole: string): void => {
  Cookies.set(roleKey, currentRole)
}
export const getCurrentRole = () => {
  return Cookies.get(roleKey)
}

export function removeCurrentRole() {
  return Cookies.remove(roleKey)
}

const organizationKey = 'organizationUuid'
export const setCurrentOrganization = (currentOrganization: string) => {
  Cookies.set(organizationKey, currentOrganization)
}

export const getCurrentOrganization = () => {
  return Cookies.get(organizationKey)
}

export function removeCurrentOrganization() {
  return Cookies.remove(organizationKey)
}

const warehouseKey = 'warehouseUuid'
export function setCurrentWarehouse(currentWarehouse: string) {
  Cookies.set(warehouseKey, currentWarehouse)
}

export function getCurrentWarehouse() {
  return Cookies.get(warehouseKey)
}

export function removeCurrentWarehouse() {
  return Cookies.remove(warehouseKey)
}
