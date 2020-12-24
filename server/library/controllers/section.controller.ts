import { Section } from '@dynrec/common';
import { get } from 'lodash';
import { Controller, Resource } from '../decorators';
import { HttpArgs } from '../helpers/route.helper';

@Controller
@Resource(Section, {
    sortable: {
        dataDictionary: {
            course: section => get(section, 'course.name'),
            ta: section => get(section, 'ta.firstName') + ' ' + get(section, 'ta.lastName'),
            instructor: section => get(section, 'instructor.firstName') + ' ' + get(section, 'instructor.lastName'),
        },
    },
    searchable: [
        'index',
        'sectionNumber',
        'ta.firstName',
        'ta.lastName',
        'ta.username',
        'instructor.firstName',
        'instructor.lastName',
        'instructor.username',
    ],
    dataDict: (args: HttpArgs<Section>) => {
        const { body } = args;
        return {
            index: body.index,
            sectionNumber: body.sectionNumber,
            ta: body.ta,
            instructor: body.instructor,
            course: body.course,
            meetingTimes: body.meetingTimes,
        };
    },
})
export class SectionController {}
