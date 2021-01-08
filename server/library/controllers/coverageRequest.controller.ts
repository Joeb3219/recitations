import { CoverageRequest } from '@dynrec/common';
import Boom from '@hapi/boom';
import { Controller, GetRequest, Resource } from '../decorators/index';
import { HttpArgs } from '../helpers/route.helper';

@Controller
@Resource(CoverageRequest, {
    sortable: {
        dataDictionary: {
            course: request => request.course.name,
            meetingTime: request => request.meetingTime.id,
            date: request => request.date,
            coveredBy: request => request.coveredBy?.getFullName(),
            reason: request => request.reason,
        },
    },
    searchable: ['course.name', 'reason', 'coveredBy.firstName', 'coveredBy.lastName'],
    dataDict: (args: HttpArgs<CoverageRequest>) => {
        const { body } = args;
        return {
            course: body.course,
            date: body.date,
            meetingTime: body.meetingTime,
            coveredBy: body.coveredBy,
            reason: body.reason,
        };
    },
})
export class CoverageRequestController {
    @GetRequest('/course/:courseID/coveragerequest/:requestID/cover')
    async toggleCoverage({
        params,
        currentUser,
        ability,
    }: HttpArgs<never, { requestID: string }>): Promise<CoverageRequest> {
        const { requestID } = params;

        const coverage = await CoverageRequest.findOne({ id: requestID });
        if (!coverage) {
            throw Boom.notFound('Failed to find selected coverage request');
        }

        if (!ability.can('use', coverage)) {
            throw Boom.unauthorized('Unauthorized to cover selected coverage request.');
        }

        // Nobody is covering it, so we will now cover it!
        if (!coverage.coveredBy) {
            coverage.coveredBy = currentUser;
            await coverage.save();
            return coverage;
        }

        // Somebody is covering, ensure it's the current user
        if (coverage.coveredBy.id !== currentUser.id) {
            throw Boom.badRequest('Only the covering user can cancel coverage.');
        }

        coverage.coveredBy = null;
        await coverage.save();
        return coverage;
    }
}
