import { LoginRequestDTO ,LoginSuccessResponseDTO} from "./models/login.api";
import { Observable } from "rxjs";
import { MeSuccessResponseDTO } from "./models/me.api";

export interface AuthPort {
  login(request: LoginRequestDTO): Observable<LoginSuccessResponseDTO>;
  me(): Observable<MeSuccessResponseDTO>;
}