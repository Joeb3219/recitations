import { Course, Meeting, Todo, User } from '@dynrec/common';
export type TodoType = 'attend_recitation' | 'take_recitation_quiz' | 'post_recitation_feedback';

export abstract class TodoDatasource {
    abstract id: TodoType;

    abstract generateTodos(course: Course, meetings: Meeting[], user: User): Promise<Todo[]> | Todo[];
}
