import {
  ApiError,
  ApiException,
  ApiSuccessResponseBody,
  BadRequestException,
  CategoryNameAlreadyExistsException,
  CategoryNotFoundException,
  InternalServerException,
  NetworkException,
  SessionInvalidException,
  UnauthorizedActionError,
  UnknownApiException,
} from "../../../../../../core/shared/api/api.responseTypes";
import { CategoryGenderDTO } from "./getCategories.api";


export interface UpdateCategoryRequestPathParamsDTO {
  categoryId: number;
}

export interface UpdateCategoryRequestDTO {
    name?: string;
    description?: string;
}


export interface UpdateCategoryDTO {
    id: number,
    name: string,
    gender: CategoryGenderDTO,
    slug: string,
    description: string,
    isActive: boolean,
    updatedAt: string,
    createdAt: string,
}

export type UpdateCategorySuccessResponseDTO = ApiSuccessResponseBody<UpdateCategoryDTO>;



export function mapUpdateCategoryError(err: ApiError): ApiException {
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

    case "CATEGORY.ALREADY_EXISTS":
      return new CategoryNameAlreadyExistsException(err.code, err.message);

    case "SYSTEM.INTERNAL_ERROR":
      return new InternalServerException(err.code, err.message);

    default:
      return new UnknownApiException(err.message);
  }
}
