import { GradebookOverride } from '@dynrec/common';
import { Controller, Resource } from '../decorators/controller.decorator';
import { HttpArgs } from '../helpers/route.helper';

@Controller
@Resource(GradebookOverride, {
    sortable: {
        dataDictionary: {
            course: override => override.course.name,
        },
    },
    searchable: ['course.name'],
    dataDict: (args: HttpArgs<GradebookOverride>) => {
        const { body } = args;
        return {
            dateRangeOverrides: body.dateRangeOverrides ?? [],
            meetingOverrides: body.meetingOverrides ?? [],
            userOverrides: body.userOverrides ?? [],
            reason: body.reason,
            overrideQuiz: body.overrideQuiz ?? false,
            overrideAttendance: body.overrideAttendance ?? false,
            course: body.course,
            creator: body.creator ?? args.currentUser,
        };
    },
})
export class GradebookOverrideController {}
