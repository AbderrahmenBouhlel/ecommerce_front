import { HttpErrorResponse } from "@angular/common/http";

export interface ApiSuccessResponseBody<T>{
  timestamp: string;
  code: string;
  message: string;
  data: T;
}


export interface ApiErrorResponseBody{
  timestamp: string;
  code: string;
  message: string;
}






export class ApiException extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "ApiException";
  }
}

export class SessionInvalidException extends ApiException {
  constructor(code: string, message: string) {
    super(401, code, message);
    this.name = "SessionInvalidException";
  }
}

export class UnauthorizedActionError extends ApiException {
  constructor(code: string, message: string) {
    super(403, code, message);
    this.name = "UnauthorizedActionError";
  }
}


export class ServiceUnavailableError extends ApiException {
  constructor(code: string, message: string) {
    super(503, code, message);
    this.name = "ServiceUnavailableError";
  }
}

export class InternalServerException extends ApiException {
  constructor(code: string, message: string) {
    super(500, code, message);
    this.name = "InternalServerException";
  }
}

export class BadRequestException extends ApiException {
  constructor(code: string, message: string) {
    super(400, code, message);
    this.name = "BadRequestException";
  }
}

export class NetworkException extends ApiException {
  constructor(message: string = "Network error") {
    super(0, "NETWORK_ERROR", message);
    this.name = "NetworkException";
  }
}

export class UnknownApiException extends ApiException {
  constructor(message: string = "Unknown error") {
    super(0, "UNKNOWN_ERROR", message);
    this.name = "UnknownApiException";
  }
}


// filter related exceptions
export class FilterNameAlreadyExistsException extends ApiException {
  constructor(code: string, message: string) {
    super(409, code, message);
    this.name = "FilterNameAlreadyExistsException";
  }
}

export class FilterNotFoundException extends ApiException {
  constructor(code: string, message: string) {
    super(404, code, message);
    this.name = "FilterNotFoundException";
  }
}


// category related exceptions
export class CategoryNameAlreadyExistsException extends ApiException {
  constructor(code: string, message: string) {
    super(409, code, message);
    this.name = "CategoryNameAlreadyExistsException";
  }
}
export class CategoryNotFoundException extends ApiException {
  constructor(code: string, message: string) {
    super(404, code, message);
    this.name = "CategoryNotFoundException";
  }
}
export class CategoryInactiveException extends ApiException {
  constructor(code: string, message: string) {
    super(400, code, message);
    this.name = "CategoryInactiveException";
  }
}



// product realted exceptions
export class ProductNotFoundException extends ApiException {
  constructor(code: string, message: string) {
    super(404, code, message);
    this.name = "ProductNotFoundException";
  }
}

export class ProductArchivedException extends ApiException {
  constructor(code: string, message: string) {
    super(409, code, message);
    this.name = "ProductArchivedException";
  }
}

export class ProductDuplicateNameException extends ApiException {
  constructor(code: string, message: string) {
    super(409, code, message);
    this.name = "ProductDuplicateNameException";
  }
}

export class DuplicateColorNameInProductException extends ApiException {
  constructor(code: string, message: string) {
    super(409, code, message);
    this.name = "DuplicateColorNameInProductException";
  }
}

export class DuplicateSizeInVariantException extends ApiException {
  constructor(code: string, message: string) {
    super(409, code, message);
    this.name = "DuplicateSizeInVariantException";
  }
}

export class VariantNotFoundException extends ApiException {
  constructor(code: string, message: string) {
    super(404, code, message);
    this.name = "VariantNotFoundException";
  }
}


export class UnsupportedVariantImageContentTypeException extends ApiException {
  constructor(code: string, message: string) {
    super(400, code, message);
    this.name = "UnsupportedVariantImageContentTypeException";
  }
}

export class VariantImagesSizeLimitExceededException extends ApiException {
  constructor(code: string, message: string) {
    super(413, code, message);
    this.name = "VariantImagesSizeLimitExceededException";
  }
}


export class ResourceNotFoundException extends ApiException {
  constructor(code: string, message: string) {
    super(404, code, message);
    this.name = "ResourceNotFoundException";
  }
}











export interface ApiError {
  status: number;
  code: string;
  message: string;
  kind: "network" | "backend" | "unknown";
}


function isHttpError(err: any): err is HttpErrorResponse {
  return err instanceof HttpErrorResponse;
}


export function normolizeToApiError(err: any): ApiError {
  
  if (isHttpError(err)) {
    // Network error (status 0) is a special case
    if (err.status === 0) {
      return {
        status: 0,
        code: "NETWORK_ERROR",
        message: "Server unreachable or network error",
        kind: "network"
      };
    }

    return {
      status: err.status,
      code: err.error?.code ?? "UNKNOWN_ERROR",
      message: err.error?.message ?? "An unknown server error occurred.",
      kind: "backend"
    };
  }

  // 3. anything else (frontend bug, thrown error, etc.)
  return {
    status: 0,
    code: "UNKNOWN_ERROR",
    message: "Unexpected client error.",
    kind: "unknown"
  };
}