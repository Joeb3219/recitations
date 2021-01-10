// import CASAuthentication from 'cas-authentication';
import Express from 'express';
import session from 'express-session';

export type AuthMechanism = 'cas' | 'manual';

export class CASHelper {
    static getAuthMechanism(): AuthMechanism {
        if (process.env.AUTH_MECHANISM === 'cas') return 'cas';
        return 'manual';
    }

    static getCASRoutes(app?: Express.Express) {
        const config = this.getCASConfig();
        if (!config || !app || !process.env.CAS_JWT_TOKEN) {
            return;
        }

        app.use(
            session({
                secret: process.env.CAS_JWT_TOKEN,
                resave: false,
                saveUninitialized: true,
            })
        );
    }

    private static getCASConfig() {
        if (this.getAuthMechanism() !== 'cas') {
            return undefined;
        }

        return undefined;
        // return new CASAuthentication({
        //     cas_url: process.env.CAS_URL,
        //     service_url: process.env.SERVICE_URL,
        // });
    }
}
