interface IEntityData {
  id: number;
  uuid: string;
  tableName: string;
  attributes: any;
}

interface IEntityListData {
  nextPageToken: string;
  recordCount: number;
  recordsList: IEntityData[];
}

interface ITranslationData {
  language: string;
  uuid: string;
  values: any;
}
