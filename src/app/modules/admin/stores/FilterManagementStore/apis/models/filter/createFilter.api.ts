import {
  ApiError,
  ApiException,
  ApiSuccessResponseBody,
  BadRequestException,
  InternalServerException,
  NetworkException,
  ServiceUnavailableError,
  SessionInvalidException,
  UnauthorizedActionError,
  UnknownApiException,
  FilterNameAlreadyExistsException
} from "../../../../../../../core/shared/api/api.responseTypes";

export interface CreateFilterRequestDTO {
  name: string;
  description: string;
}

export interface CreateFilterDTO {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  slug: string;
  isActive: boolean;
}

export type CreateFilterSuccessResponseDTO = ApiSuccessResponseBody<CreateFilterDTO>;



export function mapCreateFilterError(err: ApiError): ApiException {
  if (err.kind === "network") {
    return new NetworkException(err.message ?? "Server unreachable or network error");
  }

  switch (err.code) {
    case "REQUEST.INVALID":
      return new BadRequestException(err.code, err.message);

    case "AUTH.MISSING_TOKEN":
    case "AUTH.EXPIRED_TOKEN":
    case "AUTH.INVALID_TOKEN":
      return new SessionInvalidException(err.code, err.message);

    case "AUTH.UNAUTHORIZED_ACTION":
      return new UnauthorizedActionError(err.code, err.message);

    case "FILTER.NAME_ALREADY_EXISTS":
      return new FilterNameAlreadyExistsException(err.code, err.message);

    case "SYSTEM.SERVICE_UNAVAILABLE":
      return new ServiceUnavailableError(err.code, err.message);

    case "SYSTEM.INTERNAL_ERROR":
      return new InternalServerException(err.code, err.message);

    default:
      return new UnknownApiException(err.message);
  }
}
