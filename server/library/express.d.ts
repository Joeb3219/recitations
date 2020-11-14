import { User } from '@dynrec/common';
import * as express from 'express';

declare namespace Express {
    export interface Response {
        locals: {
            currentUser?: User;
        };
    }

    export interface Request {
        body: unknown;
    }
}

export type HttpRequest<
    BodyType extends any = any,
    QueryType extends any = any,
    ParamsType extends any = any
> = express.Request &
    Express.Request & {
        body: BodyType;
        query: QueryType;
        params: ParamsType;
    };

export type HttpResponse = express.Response & Express.Response;
