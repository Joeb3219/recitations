import { EmailProps, EmailProviderType } from '@dynrec/common';

export abstract class EmailProvider {
    static type: EmailProviderType;

    abstract sendEmail: (email: EmailProps) => Promise<void>;
}
