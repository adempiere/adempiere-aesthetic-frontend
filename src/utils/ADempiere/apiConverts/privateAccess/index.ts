import { IPrivateAccessData } from "./types";

export function convertPrivateAccess(
  privateAccessToConvert: any
): IPrivateAccessData {
  return {
    tableName: privateAccessToConvert.table_name,
    recordId: privateAccessToConvert.record_id,
    recordUuid: privateAccessToConvert.record_uuid
  };
}
