import {
  ApiRest as requestRest,
  evaluateResponse
} from '@/ADempiere/shared/services/instances';
import { convertField, convertReference, IFieldData, IReferenceData } from '@/ADempiere/modules/field';
import { convertWindow, convertProcess, convertBrowser, convertForm, convertValidationRule } from '.';
import { IBrowserData, IDictionaryFieldRequest, IDictionaryRequest, IFormData, IProcessData, IValidationRule, IWindowData } from './DictionaryType';

export const requestWindowMetadata = (data: IDictionaryRequest) : Promise<IWindowData> => {
  const { id, uuid } = data;
  return requestRest({
    url: '/dictionary/window',
    method: 'get',
    params: {
      uuid,
      id
    }
  })
    .then(evaluateResponse)
    .then(response => {
      return convertWindow(response);
    });
};

/**
   * Request dictionary Process/Report metadata
   * @param {string} uuid universally unique identifier
   * @param {number} id, identifier
   */
export function requestProcessMetadata(data: IDictionaryRequest): Promise<IProcessData> {
  const { id, uuid } = data;
  return requestRest({
    url: '/dictionary/process',
    method: 'get',
    params: {
      uuid,
      id
    }
  })
    .then(evaluateResponse)
    .then(response => {
      return convertProcess(response);
    });
}

/**
   * Request dictionary Smart Browser metadata
   * @param {string} uuid universally unique identifier
   * @param {number} id, identifier
   */
export function requestBrowserMetadata(data: IDictionaryRequest) : Promise<IBrowserData> {
  const { id, uuid } = data;
  return requestRest({
    url: '/dictionary/browser',
    method: 'get',
    params: {
      uuid,
      id
    }
  })
    .then(evaluateResponse)
    .then(response => {
      return convertBrowser(response);
    });
}

/**
   * Request dictionary Form metadata
   * @param {string} uuid universally unique identifier
   * @param {number} id, integer identifier
   */
export function requestForm(data: IDictionaryRequest) : Promise<IFormData> {
  const { id, uuid } = data;
  return requestRest({
    url: '/dictionary/form',
    method: 'get',
    params: {
      uuid,
      id
    }
  })
    .then(evaluateResponse)
    .then(response => {
      return convertForm(response);
    });
}

export function requestFieldMetadata(data: IDictionaryFieldRequest) : Promise<IFieldData> {
  return requestRest({
    url: '/dictionary/field',
    method: 'get',
    params: {
      uuid: data.uuid,
      column_uuid: data.columnUuid,
      element_uuid: data.elementUuid,
      field_uuid: data.fieldUuid,
      // TableName + ColumnName
      table_name: data.tableName,
      column_name: data.columnName,
      element_column_name: data.elementColumnName
    }
  })
    .then(evaluateResponse)
    .then(response => {
      return convertField(response);
    });
}

export function requestReference(data: { uuid: string, columnName: string }) : Promise<IReferenceData> {
  return requestRest({
    url: '/dictionary/reference',
    method: 'get',
    params: {
      uuid: data.uuid,
      column_name: data.columnName
    }
  })
    .then(evaluateResponse)
    .then(response => {
      return convertReference(response);
    });
}

export function requestValidationRule(data: IDictionaryRequest) : Promise<IValidationRule> {
  const { id, uuid } = data;
  return requestRest({
    url: '/dictionary/validation',
    method: 'get',
    params: {
      uuid,
      id
    }
  })
    .then(evaluateResponse)
    .then(response => {
      return convertValidationRule(response);
    });
}
