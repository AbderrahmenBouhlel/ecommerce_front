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

export type SelectableCategoryGenderDTO = "MALE" | "FEMALE";

export interface SelectableCategoryDTO {
  id: number;
  name: string;
  gender: SelectableCategoryGenderDTO;
  isActive: boolean;
}

export type GetSelectableCategoriesSuccessResponseDTO = ApiSuccessResponseBody<SelectableCategoryDTO[]>;

export function mapGetSelectableCategoriesError(err: ApiError): ApiException {
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
