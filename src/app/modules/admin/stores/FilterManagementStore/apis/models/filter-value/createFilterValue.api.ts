import {
  ApiError,
  ApiException,
  ApiSuccessResponseBody,
  BadRequestException,
  FilterNotFoundException,
  InternalServerException,
  NetworkException,
  ServiceUnavailableError,
  SessionInvalidException,
  UnauthorizedActionError,
  UnknownApiException,
} from "../../../../../../../core/shared/api/api.responseTypes";

export interface CreateFilterValueRequestPathParamsDTO {
  filterId: number;
}

export interface CreateFilterValueRequestDTO {
  name: string;
  description: string;
}

export interface CreateFilterValueDTO {
  id: number;
  filterId: number;
  name: string;
  description: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
}

export type CreateFilterValueSuccessResponseDTO = ApiSuccessResponseBody<CreateFilterValueDTO>;

export class FilterValueAlreadyExistsException extends ApiException {
  constructor(code: string, message: string) {
    super(409, code, message);
    this.name = "FilterValueAlreadyExistsException";
  }
}

export function mapCreateFilterValueError(err: ApiError): ApiException {
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

    case "FILTER.NOT_FOUND":
      return new FilterNotFoundException(err.code, err.message);

    case "FILTER_VALUE.ALREADY_EXISTS":
      return new FilterValueAlreadyExistsException(err.code, err.message);

    case "SYSTEM.SERVICE_UNAVAILABLE":
      return new ServiceUnavailableError(err.code, err.message);

    case "SYSTEM.INTERNAL_ERROR":
      return new InternalServerException(err.code, err.message);

    default:
      return new UnknownApiException(err.message);
  }
}
