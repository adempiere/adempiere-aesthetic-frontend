export enum EventActionType {
    //  Generic Action
    ACTION_PERFORMED = 1,
    FOCUS_GAINED = 2,
    FOCUS_LOST = 3,

    // Input actions
    KEY_PRESSED = 4,
    KEY_RELEASED = 5
}

export interface IFieldEvent {
    containerUuid: string
    columnName: string
    value: any
    eventType?: EventActionType
}

export interface IFieldEventExtended extends IFieldEvent {
    keyCode: string
}

export interface IActionEvent {
    containerUuid: string
    action: any
    parameters: any
}

export interface EventState {
    fieldEvents: (Required<IFieldEvent> | Required<IFieldEventExtended>)[]
    actionEvents: IActionEvent[]
}
