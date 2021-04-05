// Get Instance for connection
import {
  ApiRest as requestRest,
  evaluateResponse
} from '@/ADempiere/shared/services/instances'
import {
  IEnrollUserParams,
  IEnrollUserResponse,
  IForgotPasswordResponse
} from './EnrollmentType'

const clientVersion = '1.0.0'
const applicationType = 'ADempiere-Vue'

/**
 * enroll User
 * @param {string} userData.name
 * @param {string} userData.userName
 * @param {string} userData.password
 */

export function requestEnrollUser(
  data: IEnrollUserParams
): Promise<IEnrollUserResponse> {
  const { name, userName, password, eMail } = data
  return requestRest({
    url: '/enrollment/enroll',
    data: {
      user_name: userName,
      name,
      email: eMail,
      password,
      client_version: clientVersion,
      application_type: applicationType
    }
  })
    .then(evaluateResponse)
    .then(enrollResponse => {
      return {
        userName: enrollResponse.user_name,
        name: enrollResponse.name,
        eMail: enrollResponse.email
      }
    })
}

/**
 * Request from forgot password
 * @param {string} eMailOrUserName
 */

export function requestForgotPassword(
  eMailOrUserName: string
): Promise<IForgotPasswordResponse> {
  let userName, eMail
  if (String(eMailOrUserName).includes('@')) {
    eMail = eMailOrUserName
  } else {
    userName = eMailOrUserName
  }

  return requestRest({
    url: '/enrollment/reset-password',
    data: {
      user_name: userName,
      email: eMail,
      client_version: clientVersion,
      application_type: applicationType
    }
  })
    .then(evaluateResponse)
    .then(forgotResponse => {
      return {
        responseType: forgotResponse.response_type,
        responseTypeStatus: forgotResponse.response_type_status
      }
    })
}

/**
 * Request from reset password with token
 * @param {string} token
 * @param {string} password
 */
export function requestChangePassword(data: {
    token: string
    password: string
}): Promise<IForgotPasswordResponse> {
  const { token, password } = data
  return requestRest({
    url: '/enrollment/change-password',
    data: {
      token,
      password,
      client_version: clientVersion,
      application_type: applicationType
    }
  })
    .then(evaluateResponse)
    .then(changePasswordResponse => {
      return {
        responseType: changePasswordResponse.response_type,
        responseTypeStatus: changePasswordResponse.response_type_status
      }
    })
}

/**
 * Request from reset password with token
 * @param {string} token
 * @param {string} password
 */
export function requestActivateUser(data: {
    token: string
}): Promise<IForgotPasswordResponse> {
  const { token } = data
  return requestRest({
    url: '/enrollment/activate-user',
    data: {
      token,
      client_version: clientVersion,
      application_type: applicationType
    }
  })
    .then(evaluateResponse)
    .then(activateUserResponse => {
      return {
        responseType: activateUserResponse.response_type,
        responseTypeStatus: activateUserResponse.response_type_status
      }
    })
}
