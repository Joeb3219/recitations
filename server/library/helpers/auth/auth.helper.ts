import { NextFunction } from 'express';
import { FORBIDDEN } from 'http-status-codes';
import { HttpRequest, HttpResponse } from '../../express_custom';
export async function isAuthenticated(req: HttpRequest, res: HttpResponse, next: NextFunction) {
    if (!!res.locals.currentUser && !!res.locals.currentUser.id) next();
    else {
        res.status(FORBIDDEN).json({
            message: 'No valid login.',
            error: new Error('No valid login.'),
        });
    }
}
