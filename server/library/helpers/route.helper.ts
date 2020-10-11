/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Boom from '@hapi/boom';
import { isAuthenticated } from '@helpers/auth/auth.helper';
import { User } from '@models/user';
import { Request, Response } from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import { get, isEqual, pickBy, sortBy } from 'lodash';
import 'reflect-metadata';
import { DeleteResult, Repository } from 'typeorm';
import { BaseEntity } from '../../../client/shim/typeorm.shim';
import {
    ResourceAction,
    ResourceArgs,
} from '../decorators/controller.decorator';

function searchIn(object, key, target) {
    if (!target || !target.toString()) return true; // Ensure that the search target is actually comparable

    const data = get(object, key); // Lodash get, which will find object.path.to.key, for all key = "path.to.key".
    if (!data) return false; // A real search query was provided, but we don't have it for this key.

    if (typeof data === 'string') return data.includes(target);
    if (typeof data === 'number') return parseInt(target, 10) === data;
    return isEqual(data, target);
}

// Finds if any of the provided keys are matches for the provided target.
function multiKeySearchIn(object, keys, target) {
    return keys.filter((key) => searchIn(object, key, target)).length;
}

function searchResultData(
    results: any | any[],
    searchableFields,
    req: Request
) {
    if (!results || !Array.isArray(results) || !results.length) return results; // oops, this isn't an array afterall
    if (!searchableFields || !searchableFields.length) return results; // oops, no fields were passed in to search by.

    if (!req.query || !req.query.search) return results;

    return results.filter((result) =>
        multiKeySearchIn(result, searchableFields, req.query.search)
    );
}

function sortResultData(results: any | any[], sortableFields, req: Request) {
    if (!results || !Array.isArray(results) || !results.length) return results; // oops, this isn't an array afterall
    if (!sortableFields || !sortableFields.length) return results; // oops, no fields were passed in to search by.

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

function paginateResultData(results: any | any[], req: Request) {
    if (!results || !Array.isArray(results) || !results.length) return results; // oops, this isn't an array afterall

    let { limit, offset } = req.query;

    limit = parseInt(limit, 10) || 25;
    offset = parseInt(offset, 10) || 0;

    return limit < 0 ? results : results.slice(offset, offset + limit + 1);
}

export interface HttpArgs<ResourceModel extends BaseEntity> {
    body: Partial<ResourceModel>;
    repo: (T) => Repository<typeof T>;
    currentUser: User;
    params: any;
}

function httpMiddleware(
    target,
    method,
    route,
    { sortableFields, searchableFields }
) {
    console.log(`Generating ${method} ${route}`);
    return async (req: Request, res: Response) => {
        try {
            const result = await target({
                body: req.body,
                repo: res.locals.repo,
                currentUser: res.locals.currentUser,
                params: req.params,
            } as HttpArgs<unknown>);

            const searchedResult = searchResultData(
                result,
                searchableFields,
                req
            );
            const sortedResult = sortResultData(
                searchedResult,
                sortableFields,
                req
            );

            // and now we paginate the data
            const paginatedResult = paginateResultData(sortedResult, req);

            console.log({
                method,
                result,
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
            console.log({ method, route, err });
            if (Boom.isBoom(err)) {
                return res.status(err.output.statusCode).json({
                    message:
                        get(err, 'output.payload.message') ||
                        'An error occurred.',
                    error: err,
                });
            }
            return res.status(BAD_REQUEST).json({
                message: 'An error occurred',
                error: new Error('An error occurred'),
            });
        }
    };
}

export function generateUpdateResource<T extends BaseEntity>(
    resourceClass: BaseEntity,
    resourceName: string,
    dataFn: (HttpArgs) => unknown
) {
    return async (args: HttpArgs<T>): Promise<T> => {
        const { params, repo } = args;
        const id = params[`${resourceName}ID`];

        const updateableData = pickBy(await dataFn(args), (item) => {
            return item !== 'undefined' && item !== undefined;
        });

        // first, we find the resource that is referenced by the given ID
        let resource = await repo(resourceClass).findOne({ id });

        // no resource found, 404 it out
        if (!resource) throw Boom.notFound(`${resourceName} not found`);

        resource = Object.assign(resource, updateableData);

        // and now we can update the resource
        return repo(resourceClass).save(resource);
    };
}

export function generateGetResource<T extends BaseEntity>(
    resourceClass: BaseEntity,
    resourceName: string
) {
    return async (args: HttpArgs<T>): Promise<T> => {
        const { params, repo } = args;
        const id = params[`${resourceName}ID`];

        // first, we find the resource that is referenced by the given ID
        const resource = await repo(resourceClass).findOne({ id });

        // no resource found, 404 it out
        if (!resource) throw Boom.notFound(`${resourceName} not found`);

        return resource;
    };
}

export function generateDeleteResource<T extends BaseEntity>(
    resourceClass: BaseEntity,
    resourceName: string
) {
    return async (args: HttpArgs<T>): Promise<DeleteResult> => {
        const { params, repo } = args;
        const id = params[`${resourceName}ID`];

        // first, we find the resource that is referenced by the given ID
        const resource = await repo(resourceClass).findOne({ id });

        // no resource found, 404 it out
        if (!resource) throw Boom.notFound(`${resourceName} not found`);

        return repo(resourceClass).delete({ id });

        return resource;
    };
}

export function generateCreateResource<T extends BaseEntity>(
    resourceClass: BaseEntity,
    dataFn: (HttpArgs) => unknown
) {
    return async (args: HttpArgs<T>): Promise<T> => {
        const { repo } = args;

        const data = pickBy(await dataFn(args), (item) => {
            return item !== 'undefined' && item !== undefined;
        });

        return repo(resourceClass).save(data);
    };
}

export function generateListResource<T extends BaseEntity>(
    resourceClass: BaseEntity
) {
    return async (args: HttpArgs<T>): Promise<T[]> => {
        const { repo, params } = args;
        const { courseID } = params;

        return repo(resourceClass).find({ course: courseID });
    };
}

export function generateResource(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    app: any,
    data: {
        target: any;
        resourceName: string;
        resourceModel: new () => BaseEntity;
        args: ResourceArgs;
        generatedFunctions: ResourceAction[];
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    controller: any
): void {
    const { resourceName, resourceModel, args, generatedFunctions } = data;
    const { sortable, searchable, dataDict } = args;

    const generateInternalRoute = (
        controller,
        app,
        fn,
        route,
        method,
        args: { searchableFields; sortableFields }
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
            generateUpdateResource<typeof resourceModel>(
                resourceModel,
                resourceName,
                dataDict
            ),
            `/${resourceName}/:${resourceName}ID`,
            `put`,
            { searchableFields: undefined, sortableFields: undefined }
        );
    }

    if (generatedFunctions.includes('get')) {
        generateInternalRoute(
            controller,
            app,
            generateGetResource<typeof resourceModel>(
                resourceModel,
                resourceName
            ),
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
            generateListResource<typeof resourceModel>(resourceModel),
            `/course/:courseID/${resourceName}s`,
            `get`,
            { searchableFields: searchable, sortableFields: sortable }
        );
    }

    if (generatedFunctions.includes('create')) {
        generateInternalRoute(
            controller,
            app,
            generateCreateResource<typeof resourceModel>(
                resourceModel,
                dataDict
            ),
            `/${resourceName}`,
            `post`,
            { searchableFields: undefined, sortableFields: undefined }
        );
    }
}

export function generateRoute(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    app: any,
    data: { target: any; method: string; route: string; propertyKey: string },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    controller: any
): void {
    const { target, method, route, propertyKey } = data;
    const middlewares = [];
    const providedFunction = target[propertyKey].bind(target);

    const isUnauthenticated =
        Reflect.getMetadata('unauthenticated', controller) || false;
    const searchableFields =
        Reflect.getMetadata('searchable', controller) || undefined;
    const sortableFields =
        Reflect.getMetadata('sortable', controller) || undefined;

    if (!isUnauthenticated) middlewares.push(isAuthenticated);
    middlewares.push(
        httpMiddleware(providedFunction, method, route, {
            searchableFields,
            sortableFields,
        })
    );

    app.route(route)[method](...middlewares);
}
