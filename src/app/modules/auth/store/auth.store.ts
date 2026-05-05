import { Injectable , InjectionToken , Inject} from "@angular/core";
import { AuthPort } from "./apis/auth.port";
import { LoginRequestDTO, LoginSuccessDataDTO, LoginSuccessResponseDTO } from "./apis/models/login.api";
import { ApiException, NetworkException } from "../../../core/shared/api/api.responseTypes";
import { AuthState } from "./state/auth.state";
import { signal } from "@angular/core";
import { LoadState } from "../../../core/shared/state/load-state";
import { MeSuccessResponseDTO } from "./apis/models/me.api";
import { Session } from "./models/session.model";
import { AuthNavigationService } from "../services/AuthNavigationService/AuthNavigationService";

export const AUTH_PORT = new InjectionToken<AuthPort>('AUTH_PORT');

@Injectable({  providedIn: 'root'})
export class AuthStore {

    private authState = signal<AuthState>({ status: 'anonymous' });
    private loadState = signal<LoadState>({ status: 'idle' });

    readonly authState$ = this.authState.asReadonly();
    readonly loadingState$ = this.loadState.asReadonly();
  
 
    constructor(
        @Inject(AUTH_PORT) private authPort: AuthPort,
        private authNavigationService: AuthNavigationService
    ) {
        console.log("AuthStore initialized");
    }
    

    logout() {
        this.authState.set({ status: 'anonymous' });
        localStorage.removeItem('access_token');
    }

    login(req: LoginRequestDTO) {
        this.loadState.set({ status: 'loading' });
       
        this.authPort.login(req).subscribe({
            next: (rsp:LoginSuccessResponseDTO)=> {
                let sessionData: LoginSuccessDataDTO = rsp.data
                
                // 1- save the session data in authStore state
                this.authState.set({
                    status: 'authenticated',
                    session: sessionData
                });
                this.loadState.set({ status: 'idle' });

                // 2- save the access token in local storage
                localStorage.setItem('access_token', sessionData.token);


                // 3- navigate to the appropriate page based on the new auth state
                this.authNavigationService.handleNavigation(this.authState());
            },
            error: (err: ApiException)=>{
                console.error(err);
                this.loadState.set({ status: 'error', error: err.message });
            }
        })
    }




    public setAuthenticatedState(sessionData: Session) {
        this.authState.set({
            status: 'authenticated',
            session: sessionData
        });
    }
    public setAnonymousState() {
        this.authState.set({ status: 'anonymous' });
    }
}