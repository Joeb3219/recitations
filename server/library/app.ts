import { generateResource, generateRoute } from '@helpers/route.helper';
import { User } from '@models/user';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import 'reflect-metadata';
import { createConnection, getConnection } from 'typeorm';
import { promisify } from 'util';

class AppWrapper {
    port = 3000;

    app = null;

    connection = null;

    constructor() {
        this.init().then(() => {
            // eslint-disable-next-line no-console
            console.log('App initialization finished!');
        });
    }

    async init() {
        await this.initDB();
        await this.initExpress();
        await this.initJWTParser();
        await this.initAccessControl();
        await this.registerControllers();
        await this.listen();
    }

    async listen() {
        this.app.listen(this.port, () =>
            // eslint-disable-next-line no-console
            console.log(
                `Dynamic Recitation backend listening on port ${this.port}!`
            )
        );
    }

    async initAccessControl() {
        this.app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader(
                'Access-Control-Allow-Methods',
                'GET, POST, PUT, DELETE'
            );
            res.setHeader(
                'Access-Control-Allow-Headers',
                'Content-Type, Authorization'
            );
            res.setHeader('Access-Control-Allow-Credentials', true);
            next();
        });
    }

    async registerControllers() {
        this.app.get('/', (req, res) => res.send('Hello World'));

        // Now we go through all of the controllers in our system, and register any routes they may have
        const readDir = promisify(fs.readdir);
        const potentialControllers = await readDir('./library/controllers/');
        const allowedAffixes = ['.ts', '.js'];

        potentialControllers.forEach((fileName) => {
            const affix = allowedAffixes.find((aff) => fileName.endsWith(aff)); // we find which affix this controller ends with
            if (!affix) return; // this file doesn't end with one of the approved affixes, and thus is ignored

            // First we require the file
            // controllerFile will now contain a list of every exported module from the file
            // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
            const controllerFile = require('./controllers/' +
                fileName.replace(affix, ''));
            // We now can iterate through the exports and see which are actually classes
            const controllers = Object.keys(controllerFile)
                .map((name) => {
                    // Grab the variable itself being exported
                    const exportedVariable = controllerFile[name];
                    return Reflect.getMetadata('controllers', exportedVariable)
                        ? exportedVariable
                        : undefined;
                })
                .filter((controller) => controller); // Ensure only items that are non-null exist

            // And now we can go through and register any functions declared within these controllers
            controllers.forEach((controller) => {
                // eslint-disable-next-line new-cap
                const controllerInstance = new controller();
                const routes =
                    Reflect.getMetadata('routes', controllerInstance) || [];
                const resources =
                    Reflect.getMetadata('resources', controller) || [];
                routes.forEach((data) => {
                    generateRoute(this.app, data, controllerInstance);
                });
                resources.forEach((data) => {
                    generateResource(this.app, data, controllerInstance);
                });
            });
        });
    }

    async initJWTParser() {
        this.app.use(async function (req, res, next) {
            const headers = req.headers;

            if (headers?.authorization) {
                const auth = headers.authorization;

                // The user passed us authorization headers
                // The typical format for this header is: Bearer token
                // thus, we will split the token to remove the "Bearer " string, and assuming there is a right piece,
                // grab out just the token
                const parts = auth.split('Bearer ');

                if (parts.length === 2) {
                    const token = parts[1];

                    if (token) {
                        try {
                            // now we decode the token!
                            const decoded = jwt.verify(
                                token,
                                process.env.JWT_SECRET
                            );
                            if (decoded?.userid) {
                                res.locals.currentUser = await res.locals
                                    .repo(User)
                                    .findOne({ id: decoded.userid });
                            }
                        } catch (err) {
                            // eslint-disable-next-line no-console
                            console.error(err);
                        }
                    }
                }
            }
            next();
        });
    }

    async initDB() {
        this.connection = await createConnection();
    }

    async initExpress() {
        this.app = express();
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(async function (req, res, next) {
            res.locals.repo = (entity) => {
                return getConnection().getRepository(entity);
            };
            next();
        });
    }
}

dotenv.config();
const app = new AppWrapper();
