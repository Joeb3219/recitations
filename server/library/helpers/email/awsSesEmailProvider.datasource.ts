import { EmailProps, EmailProviderType } from '@dynrec/common';
import * as aws from 'aws-sdk';
import * as EmailValidator from 'email-validator';
import _ from 'lodash';
import { UserInterface } from '../../../../common/dist/interfaces/user.interface';
import { EmailProvider } from './emailProvider.definition';

aws.config.update({ region: 'us-east-1' });

export class AwsSESEmailProvider extends EmailProvider {
    static type: EmailProviderType = 'aws-ses';

    private isAWSEnabled() {
        return !!process.env.AWS_SECRET_ACCESS_KEY && !!process.env.AWS_ACCESS_KEY_ID;
    }

    private getSES() {
        if (!this.isAWSEnabled()) {
            throw new Error('AWS is not enabled');
        }

        return new aws.SES();
    }

    sendEmail = async (email: EmailProps) => {
        const ses = this.getSES();

        // If provided, only allow emails out to this select list
        // the default behavior is to email everybody in the recipients list.
        const approvedOutboundList: string[] = process.env.APPROVED_OUTBOUND_EMAILS
            ? JSON.parse(process.env.APPROVED_OUTBOUND_EMAILS)
            : undefined;

        // Only keep recipients w/ an active email address
        const recipients = email.recipients.filter(
            r =>
                !!r.user.email &&
                EmailValidator.validate(r.user.email) &&
                (!approvedOutboundList || approvedOutboundList.includes(r.user.email))
        );

        // Builds up an HTML or textual copy as needed.
        const body = _.pickBy(
            {
                Html:
                    'html' in email.body
                        ? {
                              Charset: 'UTF-8',
                              Data: email.body.html,
                          }
                        : undefined,
                Text:
                    'text' in email.body
                        ? {
                              Charset: 'UTF-8',
                              Data: email.body.text,
                          }
                        : undefined,
            },
            a => !!a
        );

        const emailFormatter = (user: UserInterface) => `"${user.firstName} ${user.lastName}" <${user.email}>`;

        await ses
            .sendEmail({
                Destination: {
                    // casted as string[] because TS isn't smart enough to know that they've all been filtered above.
                    CcAddresses: recipients.filter(r => r.type === 'cc').map(r => emailFormatter(r.user)),
                    BccAddresses: recipients.filter(r => r.type === 'bcc').map(r => emailFormatter(r.user)),
                    ToAddresses: recipients.filter(r => r.type === 'to').map(r => emailFormatter(r.user)),
                },
                Message: {
                    Subject: {
                        Charset: 'UTF-8',
                        Data: email.subject,
                    },
                    Body: body,
                },
                Source: '"Dynamic Recitation" <dynrec@cstoolbelt.com>',
            })
            .promise();
    };
}
