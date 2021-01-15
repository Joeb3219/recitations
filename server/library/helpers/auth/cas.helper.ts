// import CASAuthentication from 'cas-authentication';
import { User } from '@dynrec/common';
import Express from 'express';
import session from 'express-session';
import url from 'url';
import { HttpRequest, HttpResponse } from '../../express_custom';
import { UserHelper } from '../user.helper';
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
        app.get('/cas/login', (req: HttpRequest, res: HttpResponse) => {
            const query = {
                service: config.service_url + `/cas/ticket`,
                renew: false,
            };

            // Redirect to the CAS login.
            const result: string =
                config.cas_url +
                url.format({
                    pathname: '/login',
                    query: query,
                });

            return res.status(200).json({
                data: result,
                message: `Successfully called GET /cas/login`,
                metadata: {
                    total: result?.length ?? 0,
                },
            });
        });

        // This route will de-authenticate the client with the Express server and then
        // redirect the client to the CAS logout page.
        app.get('/cas/logout', config.logout);

        // eslint-disable-next-line no-underscore-dangle
        app.get('/cas/ticket', (req: HttpRequest, res: HttpResponse, next: () => void) => {
            // eslint-disable-next-line no-underscore-dangle
            // config._validateUri = `serviceValidate`;
            const func = config._handleTicket.bind(config);
            res.redirect = async (url: string | number, status?: string | number) => {
                const sessionName: string = config.session_name;
                const username = (req.session as any)[sessionName];

                try {
                    if (username) {
                        let user = await User.findOne({ username });

                        if (!user) {
                            user = await User.create({ username }).save();
                        }

                        if (user) {
                            return res.status(200).json({
                                data: UserHelper.generateJWT(user.id),
                                message: `Successfully fetched token from CAS`,
                                metadata: {
                                    total: 1,
                                },
                            });
                        }
                        throw new Error('Invalid User');
                    } else {
                        throw new Error('Invalid CAS session.');
                    }
                } catch (err) {
                    console.error(err);
                    return res.status(403).json({
                        message: 'An error occurred',
                        error: new Error('An error occurred'),
                    });
                }
            };
            return func(req, res, next);
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
