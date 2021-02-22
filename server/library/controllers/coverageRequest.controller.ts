import { CoverageRequest, EmailProps, EmailRecipient, Section } from '@dynrec/common';
import Boom from '@hapi/boom';
import { plainToClass } from 'class-transformer';
import dayjs from 'dayjs';
import _ from 'lodash';
import { Controller, GetRequest, Resource } from '../decorators/index';
import { PostRequest } from '../decorators/request.decorator';
import { EmailHelper } from '../helpers/email/email.helper';
import { RolesHelper } from '../helpers/roles.helper';
import { HttpArgs } from '../helpers/route.helper';

const dataDict = (args: HttpArgs<CoverageRequest>) => {
    const { body } = args;
    return {
        course: body.course,
        date: body.date,
        meetingTime: body.meetingTime,
        coveredBy: body.coveredBy,
        reason: body.reason,
    };
};

@Controller
@Resource(
    CoverageRequest,
    {
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
        dataDict,
    },
    ['delete', 'get', 'list', 'update']
)
export class CoverageRequestController {
    @PostRequest('/coveragerequest')
    async createCoverageRequest(args: HttpArgs<CoverageRequest>) {
        const { ability } = args;

        const data = _.pickBy(await dataDict(args), item => {
            return !!item;
        });

        if (!ability.can('create', plainToClass(CoverageRequest, data))) {
            throw Boom.unauthorized(`Unauthorized to create selected resource`);
        }

        const request = await CoverageRequest.save(data as any);

        // We reload here to ensure all relations are now up to date.
        const loadedRequest = await CoverageRequest.findOne({ id: request.id });
        if (loadedRequest) {
            // eslint-disable-next-line no-console
            await this.coverageNeededEmail(loadedRequest).catch(console.error);
        }

        return request;
    }

    async coverageNeededEmail(request: CoverageRequest) {
        const taManagers = await RolesHelper.getCourseUsersByRole(request.course, 'ta_manager');
        const TAs = await RolesHelper.getCourseUsersByRole(request.course, 'ta');
        const sections = await Section.find({ course: request.course });
        const section = sections.find(s => s.meetingTimes?.find(time => time.id === request.meetingTime.id));

        if (!section) {
            throw new Error('Failed to find section');
        }

        const email: EmailProps = {
            recipients: _.uniqBy(
                _.compact([
                    ...taManagers.map<EmailRecipient>(user => ({ user, type: 'to' })),
                    request.meetingTime.leader
                        ? {
                              user: request.meetingTime.leader,
                              type: 'to',
                          }
                        : undefined,
                    ...TAs.map<EmailRecipient>(user => ({ user, type: 'cc' })),
                ]),
                recipient => recipient.user.email
            ),
            subject: `Coverage needed for Section ${section.meetingIdentifier}`,
            body: {
                html: `Coverage needed for Section ${section.meetingIdentifier}. <br><br>
                <ul>
                <li>Course: ${request.course.name}, ${request.course.department}:${request.course.courseCode}</li>
                <li>TA: ${request.meetingTime.leader?.getFullName()}</li>
                <li>Meeting: ${section.meetingIdentifier}, ${dayjs(request.date).format('MM/DD/YYYY HH:mm')}</li>
                </ul>
                <br><br>
                If you are able to cover this request, please visit ${process.env.SERVICE_URL}/courses/${
                    request.course.id
                }/coverage-requests`,
            },
        };

        return EmailHelper.sendEmail(request.course, 'aws-ses', email);
    }

    async coverageFoundEmail(request: CoverageRequest) {
        const taManagers = await RolesHelper.getCourseUsersByRole(request.course, 'ta_manager');
        const sections = await Section.find({ course: request.course });
        const section = sections.find(s => s.meetingTimes?.find(time => time.id === request.meetingTime.id));

        if (!section) {
            throw new Error('Failed to find section');
        }

        const email: EmailProps = {
            recipients: _.uniqBy(
                _.compact([
                    ...taManagers.map<EmailRecipient>(user => ({ user, type: 'cc' })),
                    request.meetingTime.leader
                        ? {
                              user: request.meetingTime.leader,
                              type: 'to',
                          }
                        : undefined,
                ]),
                recipient => recipient.user.id
            ),
            subject: `Coverage found for Section ${section.meetingIdentifier}`,
            body: {
                html: `Coverage found for Section ${section.meetingIdentifier}. <br><br>
                <ul>
                <li>Course: ${request.course.name}, ${request.course.department}:${request.course.courseCode}</li>
                <li>TA: ${request.meetingTime.leader?.getFullName()}</li>
                <li>Accepting TA: ${request.coveredBy?.getFullName()}</li>
                <li>Meeting: ${section.meetingIdentifier}, ${dayjs(request.date).format('MM/DD/YYYY HH:mm')}</li>
                </ul>`,
            },
        };

        return EmailHelper.sendEmail(request.course, 'aws-ses', email);
    }

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

            // eslint-disable-next-line no-console
            this.coverageFoundEmail(coverage).catch(console.error);

            return coverage;
        }

        // Somebody is covering, ensure it's the current user
        if (coverage.coveredBy.id !== currentUser.id) {
            throw Boom.badRequest('Only the covering user can cancel coverage.');
        }

        coverage.coveredBy = null;
        await coverage.save();

        // eslint-disable-next-line no-console
        this.coverageNeededEmail(coverage).catch(console.error);

        return coverage;
    }
}
