import { Course, Email, EmailProps, EmailRecipient, Section } from '@dynrec/common';
import Boom from '@hapi/boom';
import _ from 'lodash';
import { Controller, GetRequest, Paginated, PostRequest } from '../decorators';
import { EmailHelper } from '../helpers/email/email.helper';
import { HttpArgs } from '../helpers/route.helper';

@Controller
export class EmailController {
    @PostRequest('/section/:sectionID/email')
    async emailSection({
        currentUser,
        params,
        body,
        ability,
    }: HttpArgs<{ body: string; subject: string }, { sectionID: string }>): Promise<Email> {
        const section = await Section.findOne({ id: params.sectionID }, { relations: ['students'] });

        if (!body.subject || !body.body) {
            throw new Error('Invalid email props');
        }

        if (!section) {
            throw Boom.notFound('No course found');
        }

        if (!ability.existsOnCourse('use', 'email', section.course)) {
            throw Boom.unauthorized('Unauthorized to send emails in course.');
        }

        const email: EmailProps = {
            recipients: _.compact([
                ...(section.students?.map<EmailRecipient>(user => ({ user, type: 'bcc' })) ?? []),
                section.ta ? { user: section.ta, type: 'to' } : undefined,
                { user: currentUser, type: 'to' },
            ]),
            subject: body.subject,
            body: {
                html: body.body,
            },
        };

        return EmailHelper.sendEmail(section.course, 'aws-ses', email, currentUser);
    }

    @GetRequest('/course/:courseID/emails')
    @Paginated()
    async getEmails({ params, ability }: HttpArgs<never, { courseID: string }>): Promise<Email[]> {
        const course = await Course.findOne({ id: params.courseID });

        if (!course) {
            throw Boom.notFound('No course found');
        }

        if (!ability.existsOnCourse('view', 'email', course)) {
            throw Boom.unauthorized('Unauthorized to fetch emails in course.');
        }

        return Email.find({ course: { id: course.id } });
    }
}
