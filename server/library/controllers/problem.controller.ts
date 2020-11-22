import { Problem } from '@dynrec/common';
import { get } from 'lodash';
import { Controller, Resource } from '../decorators';
import { HttpArgs } from '../helpers/route.helper';

@Controller
@Resource(Problem, {
    sortable: {
        dataDictionary: {
            course: problem => get(problem, 'course.name'),
            creator: problem => get(problem, 'creator.firstName') + ' ' + get(problem, 'creator.lastName'),
        },
    },
    searchable: ['name'],
    dataDict: (args: HttpArgs<Problem>) => {
        const { body, currentUser } = args;
        return {
            difficulty: body.difficulty,
            name: body.name,
            question: body.question,
            solution: body.solution,
            estimatedDuration: body.estimatedDuration,
            course: body.course,
            creator: body.creator || currentUser,
        };
    },
})
export class ProblemController {}
