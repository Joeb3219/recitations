import { Course, Todo } from '@dynrec/common';
import _ from 'lodash';
import { Controller, GetRequest } from '../../decorators';
import { HttpArgs } from '../../helpers/route.helper';
import { MeetingManager } from '../meetings/datasource/meeting.manager';
import { ALL_TODO_DATASOURCES } from './datasource/index';

@Controller
export class TodoController {
    @GetRequest('/todos')
    async getTodos({ params, ability, currentUser }: HttpArgs): Promise<Todo[]> {
        const courses = await Course.find({ relations: ['sections'] });
        const userCourses = courses.filter(course => ability.can('view', course));

        const userSections = _.flatten(
            userCourses.map(course =>
                (course.sections ?? []).filter(
                    section =>
                        section.ta?.id === currentUser.id ||
                        section.students?.find(s => s.id === currentUser.id) ||
                        (section.meetingTimes ?? []).find(time => time.leader?.id === currentUser.id)
                )
            )
        );

        const userMeetingTimeIds = _.flatten(
            userSections.map(section => (section.meetingTimes ?? []).map(time => time.id))
        );

        const courseTodos = await Promise.all(
            userCourses.map(async course => {
                const meetings = await MeetingManager.getMeetings(course);
                const userMeetings = meetings.filter(meeting => userMeetingTimeIds.includes(meeting.meetingTime.id));
                return _.flatten(
                    await Promise.all(
                        ALL_TODO_DATASOURCES.map(async source =>
                            source.generateTodos(course, userMeetings, currentUser)
                        )
                    )
                );
            })
        );

        return _.uniqBy(_.flatten(courseTodos), todo => todo.getHashId());
    }
}
