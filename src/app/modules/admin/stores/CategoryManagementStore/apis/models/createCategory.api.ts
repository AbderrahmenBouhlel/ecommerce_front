import {
  ApiError,
  ApiException,
  ApiSuccessResponseBody,
  BadRequestException,
  CategoryNameAlreadyExistsException,
  InternalServerException,
  NetworkException,
  ServiceUnavailableError,
  SessionInvalidException,
  UnauthorizedActionError,
  UnknownApiException,
} from "../../../../../../core/shared/api/api.responseTypes";

export type CategoryGenderDTO = "MALE" | "FEMALE";

export interface CreateCategoryRequestDTO {
  name: string;
  gender: CategoryGenderDTO;
  description: string;
}

export interface CreateCategoryDTO {
  id: number;
  name: string;
  gender: CategoryGenderDTO;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export type CreateCategorySuccessResponseDTO = ApiSuccessResponseBody<CreateCategoryDTO>;

export function mapCreateCategoryError(err: ApiError): ApiException {
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

    case "CATEGORY.NAME_ALREADY_EXISTS":
      return new CategoryNameAlreadyExistsException(err.code, err.message);

    case "SYSTEM.SERVICE_UNAVAILABLE":
      return new ServiceUnavailableError(err.code, err.message);

    case "SYSTEM.INTERNAL_ERROR":
      return new InternalServerException(err.code, err.message);

    default:
      return new UnknownApiException(err.message);
  }
}
