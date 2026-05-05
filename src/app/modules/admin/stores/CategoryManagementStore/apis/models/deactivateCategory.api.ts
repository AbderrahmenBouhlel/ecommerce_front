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

export interface DeactivateCategoryRequestPathParamsDTO {
  categoryId: number;
}

export interface DeactivateCategoryDTO {
  categoryId: number;
  isActive: false;
}

export type DeactivateCategorySuccessResponseDTO = ApiSuccessResponseBody<DeactivateCategoryDTO>;

export class CategoryAlreadyInactiveException extends ApiException {
  constructor(code: string, message: string) {
    super(409, code, message);
    this.name = "CategoryAlreadyInactiveException";
  }
}



export function mapDeactivateCategoryError(err: ApiError): ApiException {
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

    case "CATEGORY.ALREADY_INACTIVE":
      return new CategoryAlreadyInactiveException(err.code, err.message);

    case "SYSTEM.SERVICE_UNAVAILABLE":
      return new ServiceUnavailableError(err.code, err.message);

    case "SYSTEM.INTERNAL_ERROR":
      return new InternalServerException(err.code, err.message);

    default:
      return new UnknownApiException(err.message);
  }
}
