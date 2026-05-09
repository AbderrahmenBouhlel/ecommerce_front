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
  ProductNotFoundException,
  FilterNotFoundException,
} from "../../../../../../core/shared/api/api.responseTypes";

// Request DTOs
export interface CreateProductFilterValuesRequestBodyItemDTO {
  filter_value_id: number;
}

export interface CreateProductFilterValuesRequestDTO {
  filter_values: CreateProductFilterValuesRequestBodyItemDTO[];
}

// Response DTOs
export interface ProductFilterValueDataDTO {
  id: string;
  product_id: number;
  filter_value_id: number;
  filter_value_name: string;
}

export type CreateProductFilterValuesSuccessResponseDTO = ApiSuccessResponseBody<ProductFilterValueDataDTO[]> & {
  code: "PRODUCT_FILTER_VALUE.CREATED";
};

export class FilterValueNotAllowedForCategoryException extends ApiException {
  constructor(code: string, message: string) {
    super(409, code, message);
    this.name = "FilterValueNotAllowedForCategoryException";
  }
}

export function mapCreateProductFilterValuesError(err: ApiError): ApiException {
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

    case "PRODUCT.NOT_FOUND":
      return new ProductNotFoundException(err.code, err.message);

    case "FILTER_VALUE.NOT_FOUND":
      return new FilterNotFoundException(err.code, err.message);

    case "FILTER_VALUE.NOT_ALLOWED_FOR_CATEGORY":
      return new FilterValueNotAllowedForCategoryException(err.code, err.message);

    case "SYSTEM.SERVICE_UNAVAILABLE":
      return new ServiceUnavailableError(err.code, err.message);

    case "SYSTEM.INTERNAL_ERROR":
      return new InternalServerException(err.code, err.message);

    default:
      return new UnknownApiException(err.message);
  }
}
