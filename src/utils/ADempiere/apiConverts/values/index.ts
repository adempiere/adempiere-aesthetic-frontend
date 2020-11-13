import { IReferenceListData, IReferenceData } from "./types";

export function convertReferencesList(
  listReferencesToConvert: any
): IReferenceListData {
  return {
    recordCount: listReferencesToConvert.record_count,
    referencesList: listReferencesToConvert.records.map((record: any) => {
      return convertReference(record);
    }),
    nextPageToken: listReferencesToConvert.next_page_token
  };
}

export function convertReference(referenceToConvert: any): IReferenceData {
  const { uuid } = referenceToConvert;

  return {
    uuid,
    tableName: referenceToConvert.table_name,
    windowUuid: referenceToConvert.window_uuid,
    displayName: referenceToConvert.display_name,
    whereClause: referenceToConvert.where_clause,
    recordCount: referenceToConvert.record_count
  };
}
