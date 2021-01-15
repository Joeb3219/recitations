import Express from './express';

export type HttpRequest<
    BodyType extends any = any,
    QueryType extends any = any,
    ParamsType extends any = any
> = Express.Request & {
    body: BodyType;
    query: QueryType;
    params: ParamsType;
};

export type HttpResponse = Express.Response;
