import {
  ApiError,
  ApiException,
  ApiSuccessResponseBody,
  BadRequestException,
  CategoryNotFoundException,
  FilterNotFoundException,
  InternalServerException,
  NetworkException,
  SessionInvalidException,
  UnauthorizedActionError,
  UnknownApiException,
} from "../../../../../../core/shared/api/api.responseTypes";

export interface DisableCategoryFilterRequestPathParamsDTO {
  categoryId: number;
  filterId: number;
}

export interface DisableCategoryFilterDTO {
  categoryId: number;
  filterId: number;
}

export type DisableCategoryFilterSuccessResponseDTO = ApiSuccessResponseBody<DisableCategoryFilterDTO>;

export class CategoryFilterAlreadyDisabledException extends ApiException {
  constructor(code: string, message: string) {
    super(409, code, message);
    this.name = "CategoryFilterAlreadyDisabledException";
  }
}

export function mapDisableCategoryFilterError(err: ApiError): ApiException {
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

    case "FILTER.NOT_FOUND":
      return new FilterNotFoundException(err.code, err.message);

    case "CATEGORY_FILTER.ALREADY_DISABLED":
      return new CategoryFilterAlreadyDisabledException(err.code, err.message);

    case "SYSTEM.INTERNAL_ERROR":
      return new InternalServerException(err.code, err.message);

    default:
      return new UnknownApiException(err.message);
  }
}
