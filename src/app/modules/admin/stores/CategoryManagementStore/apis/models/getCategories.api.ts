import {
  ApiError,
  ApiException,
  ApiSuccessResponseBody,
  InternalServerException,
  NetworkException,
  ServiceUnavailableError,
  SessionInvalidException,
  UnauthorizedActionError,
  UnknownApiException,
} from "../../../../../../core/shared/api/api.responseTypes";

export type CategoryGenderDTO = "MALE" | "FEMALE";

export interface AllowedFilterDTO {
  id: number;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface CategoryDTO {
  id: number;
  name: string;
  gender: CategoryGenderDTO;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  allowedFilters: AllowedFilterDTO[];
}

export type GetCategoriesSuccessResponseDTO = ApiSuccessResponseBody<CategoryDTO[]>;

export function mapGetCategoriesError(err: ApiError): ApiException {
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

    case "SYSTEM.SERVICE_UNAVAILABLE":
      return new ServiceUnavailableError(err.code, err.message);

    case "SYSTEM.INTERNAL_ERROR":
      return new InternalServerException(err.code, err.message);

    default:
      return new UnknownApiException(err.message);
  }
}
