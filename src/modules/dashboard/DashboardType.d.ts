import { ICriteriaData } from "@/modules/core";


interface IRecentItemResponseData {
  recordCount: number;
  recentItemsList: IRecentItemData[];
  nextPageToken: string;
}

interface IRecentItemData {
  menuUuid: string;
  menuName: string;
  menuDescription: string;
  windowUuid: string;
  tabUuid: string;
  tableId: number;
  tableName: string;
  id: number;
  uuid: string;
  displayName: string;
  updated: number;
  referenceUuid: string;
  action: string;
}

interface IFavoriteData {
  menuUuid: string;
  menuName: string;
  menuDescription: string;
  referenceUuid: string;
  action: string;
}

interface IDashboardData {
  windowUuid: string;
  browserUuid: string;
  dashboardName: string;
  dashboardDescription: string;
  dashboardHtml: string;
  columnNo: number;
  lineNo: number;
  isCollapsible: boolean;
  isOpenByDefault: boolean;
  isEventRequired: boolean;
  fileName: string;
}

interface IPendingDocumentData {
  windowUuid: string;
  formUuid: string;
  documentName: string;
  documentDescription: string;
  sequence: number;
  recordCount: number;
  criteria: ICriteriaData;
}
