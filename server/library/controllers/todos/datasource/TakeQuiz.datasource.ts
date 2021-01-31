import { Course, Meeting, StudentMeetingReport, Todo, User } from '@dynrec/common';
import dayjs from 'dayjs';
import _ from 'lodash';
import { TodoDatasource, TodoType } from './todo.datasource';

export class TakeQuizTodo extends TodoDatasource {
    id: TodoType = 'take_recitation_quiz';

    private generateTodo(course: Course, meeting: Meeting, responses: StudentMeetingReport[]): Todo | undefined {
        // Can't do this quiz right now.
        if (!meeting.canTakeQuiz(course)) {
            return undefined;
        }

        const didQuiz = responses.find(
            resp => dayjs(resp.date).isSame(meeting.date) && resp.meetingTime.id === meeting.meetingTime.id
        );

        // No todo needed if the user already fulfilled the action.
        if (didQuiz) {
            return undefined;
        }

        return new Todo({
            name: 'Recitation Quiz',
            description: 'You are required to do your weekly quiz to receive credit for your recitation.',
            alertType: 'warning',
            actionText: `Click here to take the quiz`,
            actionLink: `${process.env.SERVICE_URL}/courses/${course.id}/quiz/${meeting.date.toISOString()}`,
        });
    }

    async generateTodos(course: Course, meetings: Meeting[], user: User): Promise<Todo[]> {
        // Recitation leaders don't have to do the quiz!
        const nonLeaderMeetings = await meetings.filter(
            meeting => meeting.meetingTime.leader?.id !== user.id && meeting.leader?.id !== user.id
        );

        if (!nonLeaderMeetings.length) {
            return [];
        }

        const quizResponses = await StudentMeetingReport.find({ creator: { id: user.id } });
        return _.compact(nonLeaderMeetings.map(meeting => this.generateTodo(course, meeting, quizResponses)));
    }
}
