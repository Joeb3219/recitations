import { Course, Email, EmailProps, EmailProviderType, User } from '@dynrec/common';
import { AwsSESEmailProvider } from './awsSesEmailProvider.datasource';

const ALL_PROVIDERS = [AwsSESEmailProvider];

export class EmailHelper {
    public static getProvider(type: EmailProviderType) {
        const Provider = ALL_PROVIDERS.find(prov => prov.type === type);
        if (!Provider) {
            throw new Error(`No provider found for ${type}.`);
        }

        return new Provider();
    }

    public static async sendEmail(course: Course, type: EmailProviderType, email: EmailProps, sender?: User) {
        const provider = this.getProvider(type);

        const emailResult = new Email({ course, creator: sender, email, provider: type });

        try {
            await provider.sendEmail(email);

            emailResult.status = 'success';
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
            emailResult.status = 'failed';
            emailResult.failureReason = err.toString();
        }

        return emailResult.save();
    }
}
