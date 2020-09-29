import { Problem } from '@models/problem';
import { get } from 'lodash';
import { Controller, Resource } from '../decorators';
import { HttpArgs } from '../helpers/route.helper';

@Controller
@Resource('problem', Problem, {
    sortable: {
        dataDictionary: {
            course: (problem) => get(problem, 'course.name'),
            creator: (problem) =>
                get(problem, 'creator.firstName') +
                ' ' +
                get(problem, 'creator.lastName'),
        },
    },
    searchable: ['name'],
    dataDict: (args: HttpArgs) => ({}),
})
export class ProblemController {}
