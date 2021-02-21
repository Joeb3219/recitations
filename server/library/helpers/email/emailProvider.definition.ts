import { User } from '@dynrec/common';

export type EmailProviderType = 'aws-ses' | 'other';

export type EmailRecipient = {
    user: User;
    type: 'to' | 'cc' | 'bcc';
};

export type EmailProps = {
    recipients: EmailRecipient[];
    subject: string;
    body: { html: string } | { text: string };
};

export abstract class EmailProvider {
    static type: EmailProviderType;

    abstract sendEmail: (email: EmailProps) => Promise<void>;
}
