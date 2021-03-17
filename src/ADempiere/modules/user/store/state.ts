import { getToken } from '@/utils/cookies'
import { IUserState } from '../UserType'

export const state: IUserState = {
  token: getToken() || '',
  name: '',
  avatar: '',
  corporateBrandingImage: '',
  introduction: '',
  roles: [],
  email: '',
  // Adempiere
  userUuid: '',
  role: {}, // info current role
  rolesList: [],
  organizationsList: [],
  organization: {},
  warehousesList: [],
  warehouse: {},
  isSession: false,
  sessionInfo: {},
  currentOrganization: 0
}
