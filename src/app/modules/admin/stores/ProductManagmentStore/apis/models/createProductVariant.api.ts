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
    DuplicateColorNameInProductException,
    ProductNotFoundException,
    UnsupportedVariantImageContentTypeException,
    VariantImagesSizeLimitExceededException,
} from "../../../../../../core/shared/api/api.responseTypes";

export interface CreateProductVariantRequestDTO {
  color_name: string;
  color_code: string;
  images: File[];
}

export interface CreateProductVariantImageDataDTO {
  id: number;
  image_url: string;
  order: number;
}

export interface CreateProductVariantDataDTO {
  id: number;
  product_id: number;
  color_name: string;
  color_code: string;
  createdAt: string;
  images: CreateProductVariantImageDataDTO[];
}

export interface CreateProductVariantSuccessResponseDTO
  extends ApiSuccessResponseBody<CreateProductVariantDataDTO> {
  code: "VARIANT.CREATED";
}




export function mapCreateProductVariantError(err: ApiError): ApiException {
  if (err.kind === "network") {
    return new NetworkException(err.message ?? "Server unreachable or network error");
  }

  switch (err.code) {
    case "REQUEST.INVALID":
      return new BadRequestException(err.code, err.message);

    case "VARIANT.UNSUPPORTED_IMAGE_CONTENT_TYPE":
      return new UnsupportedVariantImageContentTypeException(err.code, err.message);

    case "VARIANT.IMAGES_SIZE_LIMIT_EXCEEDED":
      return new VariantImagesSizeLimitExceededException(err.code, err.message);

    case "AUTH.MISSING_TOKEN":
    case "AUTH.EXPIRED_TOKEN":
    case "AUTH.INVALID_TOKEN":
      return new SessionInvalidException(err.code, err.message);

    case "AUTH.UNAUTHORIZED_ACTION":
      return new UnauthorizedActionError(err.code, err.message);

    case "PRODUCT.NOT_FOUND":
      return new ProductNotFoundException(err.code, err.message);
      
    case "VARIANT.DUPLICATE_COLOR_NAME_IN_PRODUCT":
      return new DuplicateColorNameInProductException(err.code, err.message);

    case "SYSTEM.SERVICE_UNAVAILABLE":
      return new ServiceUnavailableError(err.code, err.message);

    case "SYSTEM.INTERNAL_ERROR":
      return new InternalServerException(err.code, err.message);

    default:
      return new UnknownApiException(err.message);
  }
}
