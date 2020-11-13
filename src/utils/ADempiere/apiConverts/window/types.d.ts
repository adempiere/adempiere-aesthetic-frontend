export enum EntityEventType {
  INSERT = 0,
  UPDATE = 1,
  DELETE = 2
}

export interface IEntityLogData {
  logId: number;
  id: number;
  uuid: string;
  tableName: string;
  sessionUuid: string;
  userUuid: string;
  userName: string;
  transactionName: string;
  eventType: EntityEventType;
  eventTypeName: string;
  logDate: number;
  changeLogsList: IEntityLogData;
}

export interface IChangeLogData {
  columnName: string;
  displayColumnName: string;
  oldValue: string;
  newValue: string;
  oldDisplayValue: string;
  newDisplayValue: string;
  description: string;
}

export enum ModerationType {
  NOT_MODERATED = 0,
  BEFORE_PUBLISHING = 1,
  AFTER_PUBLISHING = 2
}

export enum ConfidentialType {
  PUBLIC = 0,
  PARTER = 1,
  INTERNAL = 2
}

export interface IEntityChatData {
  chatUuid: string;
  id: number;
  uuid: string;
  tableName: string;
  chatTypeUuid: string;
  description: string;
  confidentialType: ConfidentialType;
  confidentialTypeName: string;
  moderationType: ModerationType;
  moderationTypeName: string;
  logDate: number;
}

export enum ChatEntryType {
  NOTE_FLAT = 0,
  FORUM_THREADED = 1,
  WIKI = 2
}
export enum ModeratorStatusType {
  NOT_DISPLAYED = 0,
  PUBLISHED = 1,
  SUSPICIUS = 2,
  TO_BE_REVIEWED = 3
}

export interface IChatEntryData {
  chatUuid: string;
  chatEntryUuid: string;
  subject: string;
  characterData: string;
  userUuid: string;
  userName: string;
  chatEntryType: ChatEntryType;
  chatEntryTypeName: string;
  confidentialType: ConfidentialType;
  confidentialTypeName: string;
  moderatorStatus: ModeratorStatusType;
  moderatorStatusName: string;
  logDate: number;
}

export enum WorkflowStateType {
  RUNNING = 0,
  COMPLETED = 1,
  ABORTED = 2,
  TERMINATED = 3,
  SUSPENDED = 4,
  NOT_STARTED = 5
}
export enum PriorityType {
  URGENT = 0,
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
  MINOR = 4
}

export interface IWorkflowProcessData {
  processUuid: string;
  workflowUuid: string;
  workflowName: string;
  recordId: number;
  tableName: string;
  userUuid: string;
  userName: string;
  responsibleUuid: string;
  responsibleName: string;
  textMessage: string;
  processed: boolean;
  workflowStateName: string;
  workflowState: WorkflowStateType;
  priority: PriorityType;
  priorityName: string;
  workflowEventsList: IWorkflowEventData[];
  logDate: number;
}

export enum EventType {
  PROCESS_CREATED = 0,
  PROCESS_COMPLETED = 1,
  STATE_CHANGED = 2
}

export interface IWorkflowEventData {
  nodeUuid: string;
  nodeName: string;
  recordId: number;
  tableName: string;
  userUuid: string;
  userName: string;
  responsibleUuid: string;
  responsibleName: string;
  textMessage: string;
  timeElapsed: number;
  attributeName: string;
  oldValue: string;
  newValue: string;
  workflowState: WorkflowStateType;
  workflowStateName: string;
  eventType: EventType;
  eventTypeName: string;
  logDate: number;
}

export enum DurationUnitType {
  DAY = 0,
  HOUR = 1,
  MINUTE = 2,
  MONTH = 3,
  SECOND = 4,
  YEAR = 5
}
export enum PublishStatusType {
  RELEASED = 0,
  TEST = 1,
  UNDER_REVISION = 2,
  VOID = 3
}

export interface IWorkflowDefinitionData {
  uuid: string;
  value: string;
  name: string;
  description: string;
  help: string;
  tableName: string;
  responsibleUuid: string;
  priority: number;
  validFrom: number;
  isDefault: boolean;
  isValid: boolean;
  publishStatus: PublishStatusType;
  publishStatusName: string;
  durationUnit: DurationUnitType;
  durationUnitName: string;
  startNode: IWorkflowNodeData;
  workflowNodesList: IWorkflowNodeData[];
}

export enum ActionType {
  USER_CHOICE = 0,
  DOCUMENT_ACTION = 1,
  SUB_WORKFLOW = 2,
  EMAIL = 3,
  APPS_PROCESS = 4,
  SMART_VIEW = 5,
  APPS_REPORT = 6,
  SMART_BROWSE = 7,
  APPS_TASK = 8,
  SET_VARIABLE = 9,
  USER_WINDOW = 10,
  USER_FORM = 11,
  WAIT_SLEEP = 12
}

export interface IWorkflowNodeData {
  uuid: string;
  value: string;
  name: string;
  description: string;
  help: string;
  responsibleUuid: string;
  documentAction: any | string;
  priority: number;
  action: ActionType;
  actionName: string;
  transitionsList: IWorkflowTransitionData[];
}

export interface IWorkflowTransitionData {
  nodeNextUuid: string;
  description: string;
  isStdUserWorkflow: boolean;
  isSandardUserWorkflow: boolean;
  sequence: number;
  workflowConditionsList: IWorkflowConditionData[];
}

export enum ConditionType {
  AND = 0,
  OR = 1
}
export enum OperationType {
  EQUAL = 0,
  NOT_EQUAL = 1,
  LIKE = 2,
  GREATER = 4,
  GREATER_EQUAL = 5,
  LESS = 6,
  LESS_EQUAL = 7,
  BETWEEN = 8,
  SQL = 9
}
export interface IWorkflowConditionData {
  sequence: number;
  columnName: string;
  value: string;
  conditionType: ConditionType;
  conditionTypeName: string;
  operation: OperationType;
  operationName: string;
}
