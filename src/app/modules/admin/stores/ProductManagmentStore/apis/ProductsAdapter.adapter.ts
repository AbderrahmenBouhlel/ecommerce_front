import { ProductsPort } from "./ProductsPort.port";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError } from "rxjs";
import { ApiError, ApiException, normolizeToApiError } from "../../../../../core/shared/api/api.responseTypes";
import { CreateProductRequestDTO, CreateProductSuccessResponseDTO, mapCreateProductError } from "./models/createProduct.api";
import { CreateProductVariantRequestDTO, CreateProductVariantSuccessResponseDTO, mapCreateProductVariantError } from "./models/createProductVariant.api";

import { GetSelectableCategoriesSuccessResponseDTO, mapGetSelectableCategoriesError } from "./models/getSelectableCategories.api";
import { CreateProductVariantSkusRequestDTO, CreateProductVariantSkusSuccessResponseDTO, mapCreateProductVariantSkusError } from "./models/createProductVariantSkus.api";
import { CreateProductFilterValuesRequestDTO, CreateProductFilterValuesSuccessResponseDTO, mapCreateProductFilterValuesError } from "./models/createProductFilterValues.api";

@Injectable()
export class ProductsAdapter implements ProductsPort {
  private readonly baseUrl = "http://127.0.0.1:8000/api/v1/admin";

  constructor(private readonly http: HttpClient) {}

  createProduct(body: CreateProductRequestDTO): Observable<CreateProductSuccessResponseDTO> {
    return this.http.post<CreateProductSuccessResponseDTO>(`${this.baseUrl}/products`, body).pipe(
      catchError((error: unknown) => {
        const apiError: ApiError = normolizeToApiError(error);
        const apiException: ApiException = mapCreateProductError(apiError);
        throw apiException;
      }),
    );
  }

  createProductVariantSkus(variantId: number, body: CreateProductVariantSkusRequestDTO): Observable<CreateProductVariantSkusSuccessResponseDTO> {
    return this.http.post<CreateProductVariantSkusSuccessResponseDTO>(
      `${this.baseUrl}/variants/${variantId}/skus`,
      body,
    ).pipe(
      catchError((error: unknown) => {
        const apiError: ApiError = normolizeToApiError(error);
        const apiException: ApiException = mapCreateProductVariantSkusError(apiError);
        throw apiException;
      }),
    );
  }

  createProductVariant(productId: number, body: CreateProductVariantRequestDTO): Observable<CreateProductVariantSuccessResponseDTO> {
    const formData = new FormData();
    formData.append("color_name", body.color_name);
    formData.append("color_code", body.color_code);

    body.images.forEach((image: File) => {
      formData.append("images", image);
    });

    return this.http.post<CreateProductVariantSuccessResponseDTO>(
      `${this.baseUrl}/products/${productId}/variants`,
      formData,
    ).pipe(
      catchError((error: unknown) => {
        const apiError: ApiError = normolizeToApiError(error);
        const apiException: ApiException = mapCreateProductVariantError(apiError);
        throw apiException;
      }),
    );
  }


  getSelectableCategories(): Observable<GetSelectableCategoriesSuccessResponseDTO> {
    return this.http.get<GetSelectableCategoriesSuccessResponseDTO>(`${this.baseUrl}/categories/select`).pipe(
      catchError((error: unknown) => {
        const apiError: ApiError = normolizeToApiError(error);
        const apiException: ApiException = mapGetSelectableCategoriesError(apiError);
        throw apiException;
      }),
    );
  }

  createProductFilterValues(productId: number, body: CreateProductFilterValuesRequestDTO): Observable<CreateProductFilterValuesSuccessResponseDTO> {
    return this.http.post<CreateProductFilterValuesSuccessResponseDTO>(`${this.baseUrl}/products/${productId}/filter-values`, body).pipe(
      catchError((error: unknown) => {
        console.error("API Error:", error); // Log the error for debugging
        const apiError: ApiError = normolizeToApiError(error);
        const apiException: ApiException = mapCreateProductFilterValuesError(apiError);
        throw apiException;
      }),
    );
  }
}
