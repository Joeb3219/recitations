import { Lesson } from '@dynrec/common';
import { Controller, Resource } from '../decorators';
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
export class LessonController {}
