// import CASAuthentication from 'cas-authentication';
import { User } from '@dynrec/common';
import Express from 'express';
import session from 'express-session';
import { HttpRequest, HttpResponse } from '../../express_custom';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CASAuthentication = require('cas-authentication');

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

        // Unauthenticated clients will be redirected to the CAS login and then to the
        // provided "redirectTo" query parameter once authenticated.
        app.get('/cas/login', config.bounce_redirect);

        // This route will de-authenticate the client with the Express server and then
        // redirect the client to the CAS logout page.
        app.get('/cas/logout', config.logout);

        // eslint-disable-next-line no-underscore-dangle
        app.post('/cas/ticket', config._handleTicket.bind(config));

        app.get('/cas/me', async (req: HttpRequest, res: HttpResponse) => {
            const sessionName: string = config.session_name;
            const username = (req.session as any)[sessionName];

            try {
                if (username) {
                    const user = await User.findOne({ username });

                    if (user) {
                        res.status(200).json({
                            data: user,
                            message: `Successfully called get /cas/me`,
                            metadata: {
                                total: 1,
                            },
                        });
                    }
                } else {
                    throw new Error('Invalid CAS session.');
                }
            } catch (err) {
                return res.status(403).json({
                    message: 'An error occurred',
                    error: new Error('An error occurred'),
                });
            }
        });
    }

    private static getCASConfig() {
        if (this.getAuthMechanism() !== 'cas') {
            return undefined;
        }

        return new CASAuthentication({
            cas_url: process.env.CAS_URL,
            service_url: process.env.SERVICE_URL,
            cas_version: process.env.CAS_VERSION,
        });
    }
}
