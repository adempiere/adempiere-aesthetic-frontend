export interface IPrefrenceData {
    parentUuid?: string
    containerUuid?: string
    columnName: string
    value: any
}

export interface IKeyValuePreference {
    [key: string]: any
}

export interface PreferenceState {
    preference: IKeyValuePreference
}

export const state: PreferenceState = {
  preference: {}
}
