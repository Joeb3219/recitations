export type TodoAlertType = 'success' | 'danger' | 'warning' | 'info';
export interface TodoInterface {
    name: string;
    description: string;
    alertType: TodoAlertType;
    actionText?: string;
    actionLink?: string;
    deadline?: Date;
}
