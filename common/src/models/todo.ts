import { TodoAlertType, TodoInterface } from '../interfaces/todo.interface';

export class Todo implements TodoInterface {
    name: string;
    alertType: TodoAlertType;
    description: string;
    actionText?: string;
    actionLink?: string;
    deadline?: Date;

    constructor(args: Partial<Todo> = {}) {
        Object.assign(this, args);
    }

    getHashId(): number {
        const baseStr = JSON.stringify({
            name: this.name,
            alertType: this.alertType,
            description: this.description,
            actionLink: this.actionLink,
            actionText: this.actionText,
            deadline: this.deadline,
        });
        // Based loosely on the Java hash function.
        return baseStr.split('').reduce<number>((hash, char) => {
            const charCode = char.charCodeAt(0);
            // eslint-disable-next-line no-bitwise
            const firstStep = (hash << 5) - hash + charCode;
            // eslint-disable-next-line no-bitwise
            return Math.abs(firstStep | 0);
        }, 0);
    }
}
