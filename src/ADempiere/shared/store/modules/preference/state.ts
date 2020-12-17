import { IKeyValueObject } from '@/ADempiere/shared/utils/types'

export interface IPrefrenceData {
    parentUuid?: string
    containerUuid?: string
    columnName: string
    value: any
}

export interface PreferenceState {
    preference: IKeyValueObject<any>
}

export const state: PreferenceState = {
  preference: {}
}
