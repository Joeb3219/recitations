import { Course, Lesson, MeetingTime, Section } from '@dynrec/common';
import Boom from '@hapi/boom';
import { Any } from 'typeorm';
import { Controller, GetRequest, Resource } from '../decorators';
import { HttpArgs } from '../helpers/route.helper';

@Controller
@Resource(Lesson, {
    sortable: {
        dataDictionary: {
            course: lesson => lesson.course.name,
            lessonPlan: lesson => lesson.lessonPlan.name,
            meetingTime: lesson => lesson.meetingTime?.id,
            quiz: lesson => lesson.quiz?.name,
        },
    },
    searchable: ['course.name', 'lessonPlan.name', 'meetingTime.id', 'quiz.name', 'beginDate', 'endDate'],
    dataDict: (args: HttpArgs<Lesson>) => {
        const { body } = args;
        return {
            beginDate: body.beginDate,
            endDate: body.endDate,
            meetingTime: body.meetingTime,
            quiz: body.quiz,
            course: body.course,
            lessonPlan: body.lessonPlan,
        };
    },
})
export class LessonController {
    @GetRequest('/course/:courseID/lessons')
    async getCourseLessons({ params, ability }: HttpArgs<never, { courseID: string }>) {
        const course = await Course.findOne({ id: params.courseID });

        if (!course) {
            throw Boom.notFound('Unable to find course.');
        }

        if (!ability.can('view', course)) {
            throw Boom.unauthorized("Unauthorized to view this course's lessons.");
        }

        const lessons = await Lesson.createQueryBuilder('lesson')
            .where({ course })
            .leftJoinAndSelect('lesson.lessonPlan', 'lessonPlan')
            .leftJoinAndSelect('lessonPlan.steps', 'steps')
            .leftJoinAndSelect('steps.problem', 'problem')
            .leftJoinAndSelect('lesson.course', 'course')
            .leftJoinAndSelect('lesson.quiz', 'quiz')
            .leftJoinAndSelect('lesson.meetingTime', 'meetingTime')
            .getMany();

        return lessons.filter(lesson => ability.can('view', lesson));
    }

    @GetRequest('/section/:sectionID/lessons')
    async getSectionLessons({ params, ability }: HttpArgs<never, { sectionID: string }>) {
        const section = await Section.findOne({ id: params.sectionID });

        if (!section) {
            throw Boom.notFound('Unable to find section.');
        }

        if (!ability.can('view', section)) {
            throw Boom.unauthorized("Unauthorized to view this section's lesosn.");
        }

        const meetingTimes = await MeetingTime.find({ meetable: section });

        return Lesson.find({ meetingTime: Any(meetingTimes) });
    }
}
