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

export interface CategoryFilterValueDTO {
  id: number;
  value: string;
  slug: string;
  is_active: boolean;
}

export interface CategoryFilterWithMetadataDTO {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  filter_values: CategoryFilterValueDTO[];
}

export type GetCategoryFiltersSuccessResponseDTO = ApiSuccessResponseBody<CategoryFilterWithMetadataDTO[]>;

export function mapGetCategoryFiltersError(err: ApiError): ApiException {
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

    case "SYSTEM.SERVICE_UNAVAILABLE":
      return new ServiceUnavailableError(err.code, err.message);

    case "SYSTEM.INTERNAL_ERROR":
      return new InternalServerException(err.code, err.message);

    default:
      return new UnknownApiException(err.message);
  }
}
