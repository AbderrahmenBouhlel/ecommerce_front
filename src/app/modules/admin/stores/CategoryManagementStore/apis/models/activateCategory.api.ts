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
  CategoryNotFoundException,
} from "../../../../../../core/shared/api/api.responseTypes";

export interface ActivateCategoryRequestPathParamsDTO {
  categoryId: number;
}

export interface ActivateCategoryDTO {
  categoryId: number;
  isActive: true;
}

export type ActivateCategorySuccessResponseDTO = ApiSuccessResponseBody<ActivateCategoryDTO>;

export class CategoryAlreadyActiveException extends ApiException {
  constructor(code: string, message: string) {
    super(409, code, message);
    this.name = "CategoryAlreadyActiveException";
  }
}

export function mapActivateCategoryError(err: ApiError): ApiException {
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

    case "CATEGORY.NOT_FOUND":
      return new CategoryNotFoundException(err.code, err.message);

    case "CATEGORY.ALREADY_ACTIVE":
      return new CategoryAlreadyActiveException(err.code, err.message);

    case "SYSTEM.SERVICE_UNAVAILABLE":
      return new ServiceUnavailableError(err.code, err.message);

    case "SYSTEM.INTERNAL_ERROR":
      return new InternalServerException(err.code, err.message);

    default:
      return new UnknownApiException(err.message);
  }
}
