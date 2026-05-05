




import { HttpInterceptor } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // 1. Clone request (requests are immutable)
        const accessToken = localStorage.getItem('access_token'); // Replace with your token retrieval logic

        if (!accessToken) {
            return next.handle(req);
        }


        const modifiedReq = req.clone(
            {
                setHeaders: {
                    Authorization: 'Bearer ' + accessToken
                }
            }
        );

        // 2. Pass to next handler in chain
        return next.handle(modifiedReq)
    }

}