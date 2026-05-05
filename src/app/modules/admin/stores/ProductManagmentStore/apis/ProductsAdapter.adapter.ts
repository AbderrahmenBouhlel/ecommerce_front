import { ProductsPort } from "./ProductsPort.port";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError } from "rxjs";
import { ApiError, ApiException, normolizeToApiError } from "../../../../../core/shared/api/api.responseTypes";
import { CreateProductRequestDTO, CreateProductSuccessResponseDTO, mapCreateProductError } from "./models/createProduct.api";
import { CreateProductVariantRequestDTO, CreateProductVariantSuccessResponseDTO, mapCreateProductVariantError } from "./models/createProductVariant.api";
import { GetSelectableCategoriesSuccessResponseDTO, mapGetSelectableCategoriesError } from "./models/getSelectableCategories.api";

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

  createProductVariant(productId: number, body: CreateProductVariantRequestDTO): Observable<CreateProductVariantSuccessResponseDTO> {
    return this.http.post<CreateProductVariantSuccessResponseDTO>(
      `${this.baseUrl}/products/${productId}/variants`,
      body,
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
}
