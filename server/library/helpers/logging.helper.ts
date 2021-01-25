import { CaptureConsole } from '@sentry/integrations';
import * as Sentry from '@sentry/node';

export const isSentryEnabled = () => process.env.SENTRY_DNS;

// Initializes Sentry for the current session
export function sentryInit() {
    if (isSentryEnabled()) {
        console.log('Initializing sentry');
        Sentry.init({
            dsn: process.env.SENTRY_DNS,
            tracesSampleRate: 0.2,
            integrations: [
                new CaptureConsole({
                    levels: ['error'],
                }),
            ],
            maxBreadcrumbs: 25,
        });
    }
}
