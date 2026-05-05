import { HttpErrorResponse } from "@angular/common/http";
import { ApiSuccessResponseBody, ApiException, ApiError,  BadRequestException, ServiceUnavailableError, InternalServerException, NetworkException, UnknownApiException} from "../../../../../core/shared/api/api.responseTypes";
import { UserRole } from "./shared.api";



// request dto
export interface LoginRequestDTO {
  email: string;
  password: string;
}


// success response data dto
export interface LoginSuccessDataDTO {
  token: string;
  user_profile: {
    id: number;       
    email: string;
    name: string;
    role: UserRole;    
  };
}

export type LoginSuccessResponseDTO = ApiSuccessResponseBody<LoginSuccessDataDTO>

// ==============================
// Error Response DTOs
// ==============================
export class InvalidCredentialsError extends ApiException {
  constructor(code: string, message: string) {
    super(401, code, message);
    this.name = "InvalidCredentialsError";
  }
}
export class UserInactiveError extends ApiException {
  constructor(code: string, message: string) {
    super(403, code, message);
    this.name = "UserInactiveError";
  }
}



export function mapLoginError(err: ApiError): ApiException {

  // 1. Network layer
  if (err.kind === "network") {
    return new NetworkException(
      err.message ?? "Server unreachable or network error"
    );
  }

  // 2. Contract-driven mapping (IMPORTANT PART)

  switch (err.code) {

    case "REQUEST.INVALID":
      return new BadRequestException(err.code, err.message);

    case "AUTH.INVALID_CREDENTIALS":
      return new InvalidCredentialsError(err.code, err.message);

    case "AUTH.USER_INACTIVE":
      return new UserInactiveError(err.code, err.message);

    case "SYSTEM.SERVICE_UNAVAILABLE":
      return new ServiceUnavailableError(err.code, err.message);

    case "SYSTEM.INTERNAL_ERROR":
      return new InternalServerException(err.code, err.message);

    default:
      return new UnknownApiException(err.message);
  }
}