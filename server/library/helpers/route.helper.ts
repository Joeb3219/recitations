/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ability, AbilityManager, Course, User } from '@dynrec/common';
import * as Boom from '@hapi/boom';
import * as Sentry from '@sentry/node';
import { plainToClass } from 'class-transformer';
import fileUpload from 'express-fileupload';
import { BAD_REQUEST } from 'http-status-codes';
import { get, isEqual, pickBy, sortBy } from 'lodash';
import 'reflect-metadata';
import { BaseEntity, DeleteResult, getRepository } from 'typeorm';
import { ResourceAction, ResourceArgs, SearchableData, SortableData } from '../decorators/controller.decorator';
import { Express } from '../express';
import { HttpRequest, HttpResponse } from '../express_custom';
import { isAuthenticated } from './auth/auth.helper';
import { isSentryEnabled } from './logging.helper';

function searchIn<ObjectType extends any = any, TargetType extends any = any>(
    object: ObjectType,
    key: string,
    target: TargetType
) {
    if (!target || !(target as any)?.toString) return true; // Ensure that the search target is actually comparable

    const data = get(object, key); // Lodash get, which will find object.path.to.key, for all key = "path.to.key".
    if (!data) return false; // A real search query was provided, but we don't have it for this key.

    if (typeof target === 'string' && typeof data === 'string') return data.includes(target);
    if (typeof target === 'string' && typeof data === 'number') return parseInt(target, 10) === data;
    return isEqual(data, target);
}

// Finds if any of the provided keys are matches for the provided target.
function multiKeySearchIn<ObjectType extends any = any, TargetType extends any = any>(
    object: ObjectType,
    keys: string[],
    target: TargetType
) {
    return keys.filter(key => searchIn<ObjectType, TargetType>(object, key, target)).length;
}

function searchResultData(results: any | any[], req: HttpRequest, searchableFields?: SearchableData) {
    if (!results || !Array.isArray(results) || !results.length) return results; // oops, this isn't an array afterall
    if (!searchableFields || !searchableFields.length) return results; // oops, no fields were passed in to search by.

    if (!req.query || !req.query.search) return results;

    return results.filter(result => multiKeySearchIn(result, searchableFields, req.query.search));
}

function sortResultData(results: any | any[], req: HttpRequest, sortableFields?: SortableData) {
    if (!results || !Array.isArray(results) || !results.length) return results; // oops, this isn't an array afterall
    if (!sortableFields) return results; // oops, no fields were passed in to search by.

    const { sort, sortDirection } = req.query;

    const { dataDictionary, defaultSortKey, defaultSortDir } = sortableFields;
    if (!dataDictionary) return results;

    // We want to grab the user's sort picks, but will default to our endpoint's picks if there aren't any
    const sortKey = sort || defaultSortKey;
    const sortDir = sortDirection || defaultSortDir || 'desc';

    // and now we see if we can actually sort by that key
    if (!sortKey) return results; // no sort key specified, so no sorting to be done

    const sortFields = [dataDictionary[sortKey] || sortKey];
    let sorted = sortBy(results, sortFields);

    if (sortDir === 'desc') sorted = sorted.reverse();

    return sorted;
}

function paginateResultData(results: any | any[], req: HttpRequest<any, { limit: string; offset: string }>) {
    if (!results || !Array.isArray(results) || !results.length) return results; // oops, this isn't an array afterall

    const { limit, offset } = req.query;

    const parsedLimit = parseInt(limit, 10) || 25;
    const parsedOffset = parseInt(offset, 10) || 0;

    return parsedLimit < 0 ? results : results.slice(parsedOffset, parsedOffset + parsedLimit + 1);
}

export interface HttpArgs<BodyType extends any = any, ParamsType extends any = never> {
    body: Partial<BodyType>;
    currentUser: User;
    params: Omit<any, 'courseID'> & { courseID: string } & ParamsType;
    file?: fileUpload.UploadedFile | undefined;
    ability: Ability;
    course?: Course;
}

export type HttpMethods = 'put' | 'post' | 'get' | 'delete';
export type ControllerFunction<T extends BaseEntity> = (
    args: HttpArgs<T>
) => Promise<T> | Promise<T[]> | Promise<DeleteResult>;

function httpMiddleware(
    target: ControllerFunction<any>,
    method: HttpMethods,
    route: string,
    { sortableFields, searchableFields }: { sortableFields?: SortableData; searchableFields?: SearchableData }
) {
    const useSentry = isSentryEnabled();
    console.log(`Generating ${method} ${route}`);
    return async (req: HttpRequest, res: HttpResponse) => {
        const transaction = useSentry
            ? Sentry?.startTransaction({
                  op: `${method} ${route}`,
                  name: `${method} ${route}`,
              })
            : undefined;

        if (useSentry) {
            Sentry.setUser({
                email: res.locals.currentUser?.email,
                username: res.locals.currentUser?.username,
                id: res.locals.currentUser?.id,
                ip_address: `{{auto}}`,
            });
        }

        try {
            const result = await target({
                body: req.body,
                currentUser: res.locals.currentUser,
                params: req.params,
                ability: AbilityManager.getUserAbilities(res.locals.currentUser),
                file: req.files ? req.files.file : undefined,
            } as HttpArgs);

            const searchedResult = searchResultData(result, req, searchableFields);
            const sortedResult = sortResultData(searchedResult, req, sortableFields);

            // and now we paginate the data
            const paginatedResult = paginateResultData(sortedResult, req);

            console.log({
                method,
                route,
                // result,
                statusCode: 200,
            });

            return res.status(200).json({
                data: paginatedResult,
                message: `Successfully called ${method} ${route}`,
                metadata: {
                    total: result?.length ?? 0,
                },
            });
        } catch (err) {
            if (useSentry) {
                Sentry.captureException(err);
            }
            console.log({ method, route, err });
            if (Boom.isBoom(err)) {
                return res.status(err.output.statusCode).json({
                    message: get(err, 'output.payload.message') || 'An error occurred.',
                    error: err,
                });
            }
            return res.status(BAD_REQUEST).json({
                message: 'An error occurred',
                error: new Error('An error occurred'),
            });
        } finally {
            transaction?.finish();
        }
    };
}

export function generateUpdateResource<T extends BaseEntity>(
    resourceClass: new () => T,
    resourceName: string,
    dataFn: (args: HttpArgs<T>) => Partial<T>
) {
    return async (args: HttpArgs<T>): Promise<T> => {
        const { params, ability } = args;
        const id = params[`${resourceName}ID`];

        const updateableData = pickBy(await dataFn(args), item => {
            return item !== undefined;
        });

        // first, we find the resource that is referenced by the given ID
        let resource = await getRepository<T>(resourceClass).findOne({
            where: { id },
        });

        if (!ability.can('update', resource)) {
            throw Boom.unauthorized(`Unauthorized to update selected ${resourceName}`);
        }

        // no resource found, 404 it out
        if (!resource) throw Boom.notFound(`${resourceName} not found`);

        resource = Object.assign(resource, updateableData);

        // and now we can update the resource
        return getRepository<T>(resourceClass).save(resource as any);
    };
}

export function generateGetResource<T extends BaseEntity>(resourceClass: new () => T, resourceName: string) {
    return async (args: HttpArgs<T>): Promise<T> => {
        const { params, ability } = args;
        const id = params[`${resourceName}ID`];

        // first, we find the resource that is referenced by the given ID
        const resource = await getRepository<T>(resourceClass).findOne({
            where: { id },
        });

        if (!ability.can('view', resource)) {
            throw Boom.unauthorized(`Unauthorized to view selected ${resourceName}`);
        }

        // no resource found, 404 it out
        if (!resource) throw Boom.notFound(`${resourceName} not found`);

        return resource;
    };
}

export function generateDeleteResource<T extends BaseEntity & { id: string }>(
    resourceClass: new () => T,
    resourceName: string
) {
    return async (args: HttpArgs<T>): Promise<DeleteResult> => {
        const { params, ability } = args;
        const id = params[`${resourceName}ID`];

        // first, we find the resource that is referenced by the given ID
        const resource = await getRepository<T>(resourceClass).findOne({
            where: { id },
        });

        if (!ability.can('delete', resource)) {
            throw Boom.unauthorized(`Unauthorized to delete selected ${resourceName}`);
        }

        // no resource found, 404 it out
        if (!resource) throw Boom.notFound(`${resourceName} not found`);

        return getRepository<T>(resourceClass).delete({ id });
    };
}

export function generateCreateResource<T extends BaseEntity>(
    resourceClass: new () => T,
    dataFn: (args: HttpArgs<T>) => Partial<T>
) {
    return async (args: HttpArgs<T>): Promise<T> => {
        const { ability } = args;

        const data = pickBy(await dataFn(args), item => {
            return !!item;
        });

        if (!ability.can('create', plainToClass(resourceClass, data))) {
            throw Boom.unauthorized(`Unauthorized to create selected resource`);
        }

        return getRepository<T>(resourceClass).save(data as any);
    };
}

export function generateListResource<T extends BaseEntity>(
    resourceClass: new () => T,
    routeArgs: { relations?: string[] }
) {
    return async (args: HttpArgs<T>): Promise<T[]> => {
        const { params, ability } = args;
        const { courseID } = params;

        const results = await getRepository<T>(resourceClass).find({
            where: { course: courseID },
            relations: routeArgs.relations ?? [],
        });
        return results.filter(result => ability.can('view', result));
    };
}

export type ResourceData<T extends BaseEntity> = {
    target: any;
    resourceName: string;
    resourceModel: new () => T;
    args: ResourceArgs;
    generatedFunctions: ResourceAction[];
};

export function generateResource<T extends BaseEntity & { id: string }>(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    app: any,
    data: ResourceData<T>,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    controller: any
): void {
    const { resourceName, resourceModel, args, generatedFunctions } = data;
    const { sortable, searchable, dataDict } = args;

    const generateInternalRoute = (
        controller: new () => unknown,
        app: Express,
        fn: ControllerFunction<T>,
        route: string,
        method: HttpMethods,
        args: {
            searchableFields?: SearchableData;
            sortableFields?: SortableData<T>;
            relations?: string[];
        }
    ) => {
        const providedFunction = fn;

        const middlewares = [isAuthenticated];
        middlewares.push(httpMiddleware(providedFunction, method, route, args));

        app.route(route)[method](...middlewares);
    };

    if (generatedFunctions.includes('update')) {
        generateInternalRoute(
            controller,
            app,
            generateUpdateResource<T>(resourceModel, resourceName, dataDict),
            `/${resourceName}/:${resourceName}ID`,
            `put`,
            { searchableFields: undefined, sortableFields: undefined }
        );
    }

    if (generatedFunctions.includes('get')) {
        generateInternalRoute(
            controller,
            app,
            generateGetResource<T>(resourceModel, resourceName),
            `/${resourceName}/:${resourceName}ID`,
            `get`,
            { searchableFields: undefined, sortableFields: undefined }
        );
    }

    if (generatedFunctions.includes('delete')) {
        generateInternalRoute(
            controller,
            app,
            generateDeleteResource(resourceModel, resourceName),
            `/${resourceName}/:${resourceName}ID`,
            `delete`,
            { searchableFields: undefined, sortableFields: undefined }
        );
    }

    if (generatedFunctions.includes('list')) {
        generateInternalRoute(
            controller,
            app,
            generateListResource<T>(resourceModel, args),
            `/course/:courseID/${resourceName}s`,
            `get`,
            { searchableFields: searchable, sortableFields: sortable }
        );
    }

    if (generatedFunctions.includes('create')) {
        generateInternalRoute(
            controller,
            app,
            generateCreateResource<T>(resourceModel, dataDict),
            `/${resourceName}`,
            `post`,
            { searchableFields: undefined, sortableFields: undefined }
        );
    }
}

export type RouteData = {
    target: any;
    method: HttpMethods;
    route: string;
    propertyKey: string;
};

export function generateRoute(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    app: any,
    data: RouteData,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    controller: any
): void {
    const { target, method, route, propertyKey } = data;
    const middlewares = [];
    const providedFunction = target[propertyKey].bind(target);

    const isUnauthenticated = !!Reflect.getMetadata('unauthenticated', target, propertyKey);
    const searchableFields = Reflect.getMetadata('searchable', target, propertyKey) ?? undefined;
    const sortableFields = Reflect.getMetadata('sortable', target, propertyKey) ?? undefined;

    if (!isUnauthenticated) middlewares.push(isAuthenticated);

    middlewares.push(
        httpMiddleware(providedFunction, method, route, {
            searchableFields,
            sortableFields,
        })
    );

    app.route(route)[method](...middlewares);
}
