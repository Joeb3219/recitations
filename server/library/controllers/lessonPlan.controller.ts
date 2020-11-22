import { LessonPlan, LessonPlanStep } from '@dynrec/common';
import { get } from 'lodash';
import { Controller, Resource } from '../decorators';
import { HttpArgs } from '../helpers/route.helper';

@Controller
@Resource(LessonPlan, {
    sortable: {
        dataDictionary: {
            course: lessonPlan => get(lessonPlan, 'course.name'),
        },
    },
    searchable: ['name', 'course.name', 'creator.firstName', 'creator.lastName', 'creator.username'],
    dataDict: (args: HttpArgs<LessonPlan>) => {
        const { body, currentUser } = args;
        return {
            name: body.name,
            steps: body.steps,
            course: body.course,
            creator: body.creator || currentUser,
        };
    },
})
@Resource(
    LessonPlanStep,
    {
        dataDict: (args: HttpArgs<LessonPlanStep>) => {
            const { body, currentUser } = args;
            return {
                type: body.type,
                title: body.title,
                description: body.description,
                estimatedDuration: body.estimatedDuration,
                problem: body.problem,
                course: body.course,
                creator: body.creator || currentUser,
            };
        },
    },
    ['create', 'get', 'update', 'delete']
)
export class LessonPlanController {}
