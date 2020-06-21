import { Response, Request } from 'express';
import * as Boom from '@hapi/boom';
import { get } from 'lodash';
import { BAD_REQUEST } from 'http-status-codes'

import { isAuthenticated } from '@helpers/auth/auth.helper'

function httpMiddleware(target, method, route) {
	return async function (req: Request, res: Response) {
		try{
			const result = await target({
				body: req.body,
				repo: res.locals.repo,
				currentUser: res.locals.currentUser,
				params: req.params,
			});	

			return res.status(200).json({
				data: result,
				method: `Successfully called ${method} ${route}`,
			})
		}catch(err) {
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

export function generateRoute(app, data) {
	const { target, method, route, propertyKey } = data;
	const middlewares = [];
	const providedFunction = target[propertyKey].bind(target);

	middlewares.push(isAuthenticated);
	middlewares.push(httpMiddleware(providedFunction, method, route));

	app.route(route)[method](...middlewares);
}