import { NextFunction } from 'express';
import { HttpRequest, HttpResponse } from '../../express_custom';
export async function isAuthenticated(req: HttpRequest, res: HttpResponse, next: NextFunction) {
    if (res.locals.currentUser) next();
    else throw new Error('Invalid login session');
}
