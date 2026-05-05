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
  ProductDuplicateNameException,
  CategoryInactiveException
} from "../../../../../../core/shared/api/api.responseTypes";

export interface CreateProductRequestDTO {
  name: string;
  description?: string;
  price: number;
  categoryId: number;
}

export interface CreateProductDataDTO {
  id: number;
  status: "DRAFT";
  name: string;
  description: string;
  price: number;
  categoryId: number;
  createdAt: string;
}

export interface CreateProductSuccessResponseDTO extends ApiSuccessResponseBody<CreateProductDataDTO> {
  code: "PRODUCT.CREATED";
}



export function mapCreateProductError(err: ApiError): ApiException {
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
    case "CATEGORY.INACTIVE":
        return new CategoryInactiveException(err.code, err.message);

    case "PRODUCT.DUPLICATE_NAME":
        return new ProductDuplicateNameException(err.code, err.message);

    case "SYSTEM.SERVICE_UNAVAILABLE":
      return new ServiceUnavailableError(err.code, err.message);

    case "SYSTEM.INTERNAL_ERROR":
      return new InternalServerException(err.code, err.message);

    default:
      return new UnknownApiException(err.message);
  }
}
