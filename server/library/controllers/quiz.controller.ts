import { Quiz } from '@dynrec/common';
import { get } from 'lodash';
import { Controller, Resource } from '../decorators';
import { HttpArgs } from '../helpers/route.helper';

@Controller
@Resource(Quiz, {
    sortable: {
        dataDictionary: {
            course: problem => get(problem, 'course.name'),
            creator: problem => get(problem, 'creator.firstName') + ' ' + get(problem, 'creator.lastName'),
        },
    },
    searchable: ['name'],
    dataDict: (args: HttpArgs<Quiz>) => {
        const { body, currentUser } = args;
        return {
            name: body.name,
            elements: body.elements,
            course: body.course,
            creator: body.creator ?? currentUser,
        };
    },
})
export class QuizController {}
