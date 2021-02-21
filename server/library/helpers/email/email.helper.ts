import { AwsSESEmailProvider } from './awsSesEmailProvider.datasource';
import { EmailProps, EmailProviderType } from './emailProvider.definition';

const ALL_PROVIDERS = [AwsSESEmailProvider];

export class EmailHelper {
    public static getProvider(type: EmailProviderType) {
        const Provider = ALL_PROVIDERS.find(prov => prov.type === type);
        if (!Provider) {
            throw new Error(`No provider found for ${type}.`);
        }

        return new Provider();
    }

    public static async sendEmail(type: EmailProviderType, email: EmailProps) {
        const provider = this.getProvider(type);

        return provider.sendEmail(email);
    }
}
