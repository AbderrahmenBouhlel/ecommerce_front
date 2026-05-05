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

export interface DeleteFilterValueRequestPathParamsDTO {
  filterValueId: number;
}

export interface DeleteFilterValueRequestQueryParamsDTO {
  confirm: boolean;
}

export interface DeleteFilterValueAffectedDTO {
  affectedProducts: number;
  affectedCategories: number;
}

export interface DeleteFilterValueDTO {
  filterValueId: number;
  affected: DeleteFilterValueAffectedDTO;
}

export type DeleteFilterValueSuccessResponseDTO = ApiSuccessResponseBody<DeleteFilterValueDTO>;

export class ConfirmationRequiredException extends ApiException {
  constructor(code: string, message: string) {
    super(400, code, message);
    this.name = "ConfirmationRequiredException";
  }
}

export function mapDeleteFilterValueError(err: ApiError): ApiException {
  if (err.kind === "network") {
    return new NetworkException(err.message ?? "Server unreachable or network error");
  }

  switch (err.code) {
    case "REQUEST.INVALID":
      return new BadRequestException(err.code, err.message);

    case "REQUEST.CONFIRMATION_REQUIRED":
      return new ConfirmationRequiredException(err.code, err.message);

    case "AUTH.MISSING_TOKEN":
    case "AUTH.EXPIRED_TOKEN":
    case "AUTH.INVALID_TOKEN":
      return new SessionInvalidException(err.code, err.message);

    case "AUTH.UNAUTHORIZED_ACTION":
      return new UnauthorizedActionError(err.code, err.message);

    case "FILTER_VALUE.NOT_FOUND":
      return new FilterNotFoundException(err.code, err.message);

    case "SYSTEM.SERVICE_UNAVAILABLE":
      return new ServiceUnavailableError(err.code, err.message);

    case "SYSTEM.INTERNAL_ERROR":
      return new InternalServerException(err.code, err.message);

    default:
      return new UnknownApiException(err.message);
  }
}
