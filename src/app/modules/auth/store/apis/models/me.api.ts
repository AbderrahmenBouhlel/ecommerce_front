import { UserRole } from "./shared.api";
import { ApiException, ApiSuccessResponseBody , ApiError, NetworkException, UnknownApiException, SessionInvalidException} from "../../../../../core/shared/api/api.responseTypes";
import { UserInactiveError } from "./login.api";



// success response data dto
export interface MeSuccessDataDTO {
  user_profile: {
    id: number;       
    email: string;
    name: string;
    role: UserRole;    
  };
}


export type MeSuccessResponseDTO = ApiSuccessResponseBody<MeSuccessDataDTO>



export function mapMeError(err: ApiError): ApiException {
    // 1. Network layer
    if (err.kind === "network") {
        return new NetworkException(
            err.message ?? "Server unreachable or network error"
        );
    }

    switch (err.code) {
        case "AUTH.EXPIRED_TOKEN":
        case "AUTH.INVALID_TOKEN":
        case "AUTH.MISSING_TOKEN":
        return new SessionInvalidException("AUTH.SESSION_INVALID", "Session expired");

        case "AUTH.USER_INACTIVE":
        return new UserInactiveError(err.code, err.message);

        default:
            return new UnknownApiException(err.message);
    }
}