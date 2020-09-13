import { HttpInterceptor, HttpHeaders, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export class TokenInterceptor implements HttpInterceptor {

    constructor() {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headers = req.headers;

        headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('jwt'));
        headers = headers.append('Content-Type', 'application/json');

        return next.handle(req.clone({ headers }));
    }

}