export interface IEnrollUserParams {
    name: string
    userName: string
    password: string
    eMail?: string
}

export interface IEnrollUserResponse {
    userName: string
    name: string
    eMail: string
}

export interface IForgotPasswordResponse {
    responseType: string
    responseTypeStatus: number
}
