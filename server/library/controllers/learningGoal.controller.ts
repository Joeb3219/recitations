import { LearningGoalCategory } from '@dynrec/common';
import { get } from 'lodash';
import { Controller, Resource } from '../decorators';
import { HttpArgs } from '../helpers/route.helper';

@Controller
@Resource(LearningGoalCategory, {
    sortable: {
        dataDictionary: {
            course: problem => get(problem, 'course.name'),
        },
    },
    searchable: ['name'],
    dataDict: (args: HttpArgs<LearningGoalCategory>) => {
        const { body } = args;
        return {
            name: body.name,
            number: body.number,
            goals: body.goals,
            course: body.course,
        };
    },
})
export class LearningGoalController {}
