
import {
  ApiError, 
  ApiException,
  ApiSuccessResponseBody,
  BadRequestException,
  FilterNameAlreadyExistsException,
  FilterNotFoundException,
  InternalServerException,
  NetworkException,
  ServiceUnavailableError,
  SessionInvalidException,
  UnauthorizedActionError,
  UnknownApiException,

 } from "../../../../../../../core/shared/api/api.responseTypes";

export interface UpdateFilterRequestPathParamsDTO {
  filterId: number;
}

export interface UpdateFilterRequestBodyDTO {
}

export interface UpdateFilterDTO {
  id: number;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  updatedAt: string;
}

export type UpdateFilterSuccessResponseDTO = ApiSuccessResponseBody<UpdateFilterDTO>;



export function mapUpdateFilterError(err: ApiError): ApiException {
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

    case "FILTER.NOT_FOUND":
      return new FilterNotFoundException(err.code, err.message);

    case "FILTER.ALREADY_EXISTS":
      return new FilterNameAlreadyExistsException(err.code, err.message);

    case "SYSTEM.SERVICE_UNAVAILABLE":
      return new ServiceUnavailableError(err.code, err.message);

    case "SYSTEM.INTERNAL_ERROR":
      return new InternalServerException(err.code, err.message);

    default:
      return new UnknownApiException(err.message);
  }
}