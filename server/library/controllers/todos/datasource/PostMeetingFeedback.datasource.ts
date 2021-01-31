import { Course, Meeting, MeetingReport, MeetingType, Section, Todo, User } from '@dynrec/common';
import dayjs from 'dayjs';
import _ from 'lodash';
import { TodoDatasource, TodoType } from './todo.datasource';

export class PostRecitationFeedbackTodo extends TodoDatasource {
    id: TodoType = 'post_recitation_feedback';

    private generateTodo(
        course: Course,
        meeting: Meeting<MeetingType.RECITATION>,
        responses: MeetingReport[]
    ): Todo | undefined {
        // Can't do this feedback right now.
        if (dayjs().isBefore(dayjs(meeting.date))) {
            return undefined;
        }

        const didFeedback = responses.find(
            resp =>
                dayjs(resp.date).isSame(meeting.date) &&
                resp.meetingTimes.find(time => time.id === meeting.meetingTime.id)
        );

        // No todo needed if the user already fulfilled the action.
        if (didFeedback) {
            return undefined;
        }

        const section = meeting.meetingTime.meetable as Section;

        return new Todo({
            name: 'Post Recitation Feedback',
            description: `You are required to do your weekly post recitation feedback for section ${
                section?.sectionNumber ?? ''
            } (Access code: ${meeting.getAccessCode()}).`,
            alertType: 'warning',
            actionText: `Click here to complete your feedback`,
            actionLink: `${process.env.SERVICE_URL}/courses/${
                course.id
            }/meeting-feedback/${meeting.date.toISOString()}`,
        });
    }

    async generateTodos(course: Course, meetings: Meeting[], user: User): Promise<Todo[]> {
        // Only recitation leaders have to do section feedback!
        const leaderMeetings = meetings.filter(
            (meeting): meeting is Meeting<MeetingType.RECITATION> =>
                (meeting.leader ?? meeting.meetingTime.leader)?.id === user.id &&
                meeting.meetingType === MeetingType.RECITATION
        );

        if (!leaderMeetings.length) {
            return [];
        }

        const meetingResponses = await MeetingReport.find({ creator: { id: user.id } });
        return _.compact(leaderMeetings.map(meeting => this.generateTodo(course, meeting, meetingResponses)));
    }
}
