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
  DuplicateSizeInVariantException,
  VariantNotFoundException,
  ProductArchivedException,
} from "../../../../../../core/shared/api/api.responseTypes";

// Request DTOs
export interface CreateProductVariantSkuItemDTO {
  size: string;
  stock: number;
}

export interface CreateProductVariantSkusRequestDTO {
  skus: CreateProductVariantSkuItemDTO[];
}

// Response DTOs
export interface CreateProductVariantSkuDataDTO {
  id: number;
  size: string;
  stock: number;
  reserved: number;
  sku_code: string;
}

export interface CreateProductVariantSkusSuccessResponseDTO
  extends ApiSuccessResponseBody<CreateProductVariantSkuDataDTO[]> {
  code: "SKU.CREATED";
}


// Error mapper
export function mapCreateProductVariantSkusError(err: ApiError): ApiException {
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

    case "RESOURCE.NOT_FOUND":
      return new VariantNotFoundException(err.code, err.message);

    case "PRODUCT.ARCHIVED":
      return new ProductArchivedException(err.code, err.message);

    case "SKU.DUPLICATE_SIZE_IN_VARIANT":
      return new DuplicateSizeInVariantException(err.code, err.message);

    case "SYSTEM.SERVICE_UNAVAILABLE":
      return new ServiceUnavailableError(err.code, err.message);

    case "SYSTEM.INTERNAL_ERROR":
      return new InternalServerException(err.code, err.message);

    default:
      return new UnknownApiException(err.message);
  }
}
