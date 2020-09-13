import "reflect-metadata";
import { Response, Request } from 'express';
import * as Boom from '@hapi/boom';
import { get, isEqual, sortBy } from 'lodash';
import { BAD_REQUEST } from 'http-status-codes'

import { isAuthenticated } from '@helpers/auth/auth.helper'
import { isNumber } from "util";

function searchIn(object, key, target) {
	if(!target || !target.toString()) return true; // Ensure that the search target is actually comparable

	const data = get(object, key); // Lodash get, which will find object.path.to.key, for all key = "path.to.key".
	if(!data) return false; // A real search query was provided, but we don't have it for this key.

	if(typeof(data) === 'string') return data.includes(target);
	if(isNumber(data)) return parseInt(target) === data;
	return isEqual(data, target);
}

// Finds if any of the provided keys are matches for the provided target.
function multiKeySearchIn(object, keys, target) {
	return keys.filter((key) => searchIn(object, key, target)).length;
}

function searchResultData(results: any | any[], searchableFields, req: Request) {
	if(!results || !results.length) return results; // oops, this isn't an array afterall
	if(!searchableFields || !searchableFields.length) return results; // oops, no fields were passed in to search by.

	if(!req.query || !req.query.search) return results;

	return results.filter((result) => multiKeySearchIn(result, searchableFields, req.query.search));
}

function sortResultData(results: any | any[], sortableFields, req: Request) {
	if(!results || !results.length) return results; // oops, this isn't an array afterall
	if(!sortableFields || !sortableFields.length) return results; // oops, no fields were passed in to search by.

	let { sort, sortDirection } = req.query;

	const { dataDictionary, defaultSortKey, defaultSortDir } = sortableFields;
	if(!dataDictionary) return results;

	// We want to grab the user's sort picks, but will default to our endpoint's picks if there aren't any
	const sortKey = sort || defaultSortKey;
	const sortDir = sortDirection || defaultSortDir || 'desc';

	// and now we see if we can actually sort by that key
	if(!sortKey) return results; // no sort key specified, so no sorting to be done

	const sortFields = [ dataDictionary[sortKey] || sortKey ];
	let sorted = sortBy(results, sortFields);

	if(sortDir == 'desc') sorted = sorted.reverse();

	return sorted;
}

function paginateResultData(results: any | any[], req: Request) {
	if(!results || !results.length) return results; // oops, this isn't an array afterall

	let { limit, offset } = req.query;

	limit = parseInt(limit) || 25;
	offset = parseInt(offset) || 0;

	return limit < 0 ? results : results.slice(offset, offset + limit + 1);
}

function httpMiddleware(target, method, route, { sortableFields, searchableFields }) {
	return async function (req: Request, res: Response) {
		try{
			const result = await target({
				body: req.body,
				repo: res.locals.repo,
				currentUser: res.locals.currentUser,
				params: req.params,
			});

			const searchedResult = searchResultData(result, searchableFields, req);
			const sortedResult = sortResultData(searchedResult, sortableFields, req);

			// and now we paginate the data
			const paginatedResult = paginateResultData(sortedResult, req);

			return res.status(200).json({
				data: paginatedResult,
				message: `Successfully called ${method} ${route}`,
				metadata: {
					total: (result && result.length) ? result.length : 0,
				}
			})
		}catch(err) {
			console.error(err);
			if(Boom.isBoom(err)) {
				return res.status(err.output.statusCode).json({
					message: get(err, 'output.payload.message') || 'An error occurred.',
					error: err,
				})
			}else {
				return res.status(BAD_REQUEST).json({
					message: 'An error occurred',
					error: new Error('An error occurred')
				})
			}
		}
	}
}

export function generateRoute(app, data, controller) {
	const { target, method, route, propertyKey } = data;
	const middlewares = [];
	const providedFunction = target[propertyKey].bind(target);

	const isUnauthenticated = Reflect.getMetadata("unauthenticated", controller) || false;
	const searchableFields = Reflect.getMetadata("searchable", controller) || undefined;
	const sortableFields = Reflect.getMetadata("sortable", controller) || undefined;

	if(!isUnauthenticated) middlewares.push(isAuthenticated);
	middlewares.push(httpMiddleware(providedFunction, method, route, { searchableFields, sortableFields }));

	app.route(route)[method](...middlewares);
}