export interface IEntityData {
  id: number
  uuid: string
  tableName: string
  attributes: any
}

export interface IEntityListData {
  nextPageToken: string
  recordCount: number
  recordsList: IEntityData[]
}

export interface ITranslationData {
  language: string
  uuid: string
  values: any
}
