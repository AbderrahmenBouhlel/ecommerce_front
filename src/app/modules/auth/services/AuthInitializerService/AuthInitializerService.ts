import { Injectable , InjectionToken , Inject} from "@angular/core";
import { AUTH_PORT, AuthStore } from "../../store/auth.store";
import { MeSuccessResponseDTO } from "../../store/apis/models/me.api";
import { Session } from "../../store/models/session.model";
import { ApiException } from "../../../../core/shared/api/api.responseTypes";
import { AuthPort } from "../../store/apis/auth.port";

import { firstValueFrom } from 'rxjs';




@Injectable({  providedIn: 'root'})
export class AuthInitializerService {


    constructor(
        @Inject(AUTH_PORT) private authPort: AuthPort,
        private authStore: AuthStore
    ) {
        console.log("AuthInitializerService initialized");
    }

    async init(): Promise<void>{
        let accessToken = localStorage.getItem('access_token');

        if (!accessToken){
            return Promise.resolve(); // No token, resolve immediately
        }
        
        try {
            const meRsp :MeSuccessResponseDTO = await firstValueFrom(this.authPort.me());
            let sessionData: Session = {
                token: accessToken!,
                user_profile: meRsp.data.user_profile
            };
            this.authStore.setAuthenticatedState(sessionData);
        } catch (err) {
            console.error("AuthInitializerService: Failed to validate token on app init", err);
            localStorage.removeItem('access_token');
            this.authStore.setAnonymousState();
        }
       
    }
}