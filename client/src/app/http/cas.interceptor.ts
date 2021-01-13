import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponseBase } from '@angular/common/http';
import { environment } from '@environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
export class CasInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponseBase) {
                    const response = event as HttpResponseBase;
                    if (response?.ok && response.url && response.url.toLowerCase().indexOf(environment.baseURL) >= 0) {
                        const queryStringIndex = response.url.indexOf('?');
                        const loginUrl =
                            queryStringIndex && queryStringIndex > 0
                                ? response.url.substring(0, queryStringIndex)
                                : response.url;
                        window.location.href = loginUrl;
                    }
                }
            })
        );
    }
}
