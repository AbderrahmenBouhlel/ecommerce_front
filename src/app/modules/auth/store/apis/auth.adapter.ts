import { HttpClient } from "@angular/common/http";
import { LoginRequestDTO, LoginSuccessResponseDTO, mapLoginError } from "./models/login.api";
import { Observable , pipe , map , catchError} from "rxjs";
import { AuthPort } from "./auth.port";
import { Injectable } from "@angular/core";
import { ApiError, normolizeToApiError } from "../../../../core/shared/api/api.responseTypes";
import { ApiException } from "../../../../core/shared/api/api.responseTypes";
import { mapMeError, MeSuccessResponseDTO } from "./models/me.api";


@Injectable()
export class authAdapter implements AuthPort {


    constructor(private http: HttpClient) {}



    login(req: LoginRequestDTO) :Observable<LoginSuccessResponseDTO>{
        return this.http.post<LoginSuccessResponseDTO>("http://127.0.0.1:8000/api/v1/auth/sessions" ,req).pipe(
            map((response: LoginSuccessResponseDTO) => {
                return response;
            }),
            // this pipe applied only on the error response (which will be inform of an exception object that contains the error response body etc)
            catchError((error : any) => {
                const apiError: ApiError = normolizeToApiError(error); // Assuming error.error contains the ApiErrorResponse
                const apiException: ApiException = mapLoginError(apiError);
                throw apiException; // Rethrow the error to be handled by the caller
            })
        );
    }


    me() :Observable<MeSuccessResponseDTO>{
        return this.http.get<MeSuccessResponseDTO>("http://127.0.0.1:8000/api/v1/auth/me").pipe(
            // this pipe applied only on the error response (which will be inform of an exception object that contains the error response body etc)
            catchError((error : any) => {
                const apiError: ApiError = normolizeToApiError(error); // Assuming error.error contains the ApiErrorResponse
                const apiException: ApiException = mapMeError(apiError);
                throw apiException; // Rethrow the error to be handled by the caller
            })
        );
    }
}