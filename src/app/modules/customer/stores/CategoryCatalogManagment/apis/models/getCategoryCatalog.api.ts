import {
  ApiError,
  ApiException,
  ApiSuccessResponseBody,
  BadRequestException,
  CategoryInactiveException,
  CategoryNotFoundException,
  InternalServerException,
  NetworkException,
  ServiceUnavailableError,
  SessionInvalidException,
  UnauthorizedActionError,
  UnknownApiException,
} from "../../../../../../core/shared/api/api.responseTypes";

export interface CategoryCatalogProductDTO {
  id: number;
  name: string;
  slug: string;
  price: number;
  cover_image_url: string;
  hover_image_url: string;
  is_active: boolean;
  filter_values: CategoryCatalogFilterValueDTO[];
}

export interface CategoryCatalogFilterValueDTO {
  id: number;
  name: string;
  slug: string;
}

export interface CategoryCatalogDataDTO {
  products: CategoryCatalogProductDTO[];
  filter_values: CategoryCatalogFilterValueDTO[];
}

export type GetCategoryCatalogSuccessResponseDTO = ApiSuccessResponseBody<CategoryCatalogDataDTO>;

export function mapGetCategoryCatalogError(err: ApiError): ApiException {
  if (err.kind === "network") {
    return new NetworkException(err.message ?? "Server unreachable or network error");
  }

  switch (err.code) {
    case "AUTH.MISSING_TOKEN":
    case "AUTH.EXPIRED_TOKEN":
    case "AUTH.INVALID_TOKEN":
      return new SessionInvalidException(err.code, err.message);

    case "AUTH.UNAUTHORIZED_ACTION":
      return new UnauthorizedActionError(err.code, err.message);

    case "REQUEST.INVALID":
      return new BadRequestException(err.code, err.message);

    case "CATEGORY.NOT_FOUND":
      return new CategoryNotFoundException(err.code, err.message);

    case "CATEGORY.INACTIVE":
      return new CategoryInactiveException(err.code, err.message);

    case "SYSTEM.SERVICE_UNAVAILABLE":
      return new ServiceUnavailableError(err.code, err.message);

    case "SYSTEM.INTERNAL_ERROR":
      return new InternalServerException(err.code, err.message);

    default:
      return new UnknownApiException(err.message);
  }
}