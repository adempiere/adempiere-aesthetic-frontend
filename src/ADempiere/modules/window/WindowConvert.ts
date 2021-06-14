import { camelizeObjectKeys, renameObjectKey } from '@/ADempiere/shared/utils/transformObject'
import {
  IEntityLogData,
  IEntityChatData,
  IChatEntryData,
  IWorkflowProcessData,
  IWorkflowDefinitionData,
  IWorkflowNodeData,
  IWorkflowTransitionData,
  IWorkflowConditionData
} from '.'

export function convertEntityLog(entityLog: any): IEntityLogData {
  const convertedLog = camelizeObjectKeys(entityLog)
  convertedLog.changeLogsList = entityLog.change_logs.map((changeLog: any) => camelizeObjectKeys(changeLog))
  delete convertedLog.changeLogs
  return convertedLog as IEntityLogData
}

export function convertEntityChat(entityChat: any): IEntityChatData {
  return camelizeObjectKeys(entityChat) as IEntityChatData
}

export function convertChatEntry(chatEntry: any): IChatEntryData {
  return camelizeObjectKeys(chatEntry) as IChatEntryData
}

export function convertWorkflowProcess(
  workflowProcess: any
): IWorkflowProcessData {
  const convertedProcess = camelizeObjectKeys(workflowProcess)
  convertedProcess.workflowEventsList = workflowProcess.workflow_events.map((item: any) => camelizeObjectKeys(item))
  delete convertedProcess.workflowEvents
  return convertedProcess as IWorkflowProcessData
}

export function convertWorkflowDefinition(
  workflowDefinition: any
): IWorkflowDefinitionData {
  const convertedDefinition = camelizeObjectKeys(workflowDefinition)
  convertedDefinition.startNode = convertWorkflowNode(workflowDefinition.start_node)
  convertedDefinition.workflowNodesList = workflowDefinition.workflow_nodes.map((item: any) => convertWorkflowNode(item))
  delete convertedDefinition.workflowNodes
  return convertedDefinition as IWorkflowDefinitionData
}

export function convertWorkflowNode(
  workflowNode: any
): IWorkflowNodeData {
  const convertedNode = camelizeObjectKeys(workflowNode)
  convertedNode.documentAction = { ...workflowNode.document_action }
  convertedNode.transitionsList = workflowNode.transitions.map((item: any) => convertWorkflowTransition(item))
  delete convertedNode.transitions
  return convertedNode as IWorkflowNodeData
}

export function convertWorkflowTransition(
  workflowTransition: any
): IWorkflowTransitionData {
  const convertedTransition = camelizeObjectKeys(workflowTransition)
  convertedTransition.isStdUserWorkflow = workflowTransition.is_standard_user_workflow
  convertedTransition.workflowConditionsList = workflowTransition.workflow_conditions.map((item: any) => convertWorkflowCondition(item))
  delete convertedTransition.workflowConditions
  return convertedTransition as IWorkflowTransitionData
}

export function convertWorkflowCondition(
  workflowCondition: any
): IWorkflowConditionData {
  const convertedCondition = camelizeObjectKeys(workflowCondition) as Partial<IWorkflowConditionData>
  renameObjectKey(convertedCondition, 'confidentialType', 'conditionType')
  renameObjectKey(convertedCondition, 'confidentialTypeName', 'conditionTypeName')
  return convertedCondition as IWorkflowConditionData
}
