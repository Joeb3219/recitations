import { CourseInterface } from './course.interface';
import { UserInterface } from './user.interface';

export type EmailStatus = 'success' | 'failed';

export type EmailProviderType = 'aws-ses' | 'other';

export type EmailRecipient = {
    user: UserInterface;
    type: 'to' | 'cc' | 'bcc';
};

export type EmailProps = {
    recipients: EmailRecipient[];
    subject: string;
    body: { html: string } | { text: string };
};

export interface EmailInterface {
    email: EmailProps;
    creator?: UserInterface;
    date: Date;
    status: EmailStatus;
    course: CourseInterface;
    provider: EmailProviderType;
    failureReason?: string;
}
