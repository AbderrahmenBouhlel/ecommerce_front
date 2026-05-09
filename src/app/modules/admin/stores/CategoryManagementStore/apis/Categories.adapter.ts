import { CategoriesPort } from "./CategoriesPort.port";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError } from "rxjs";
import { ApiError, ApiException, normolizeToApiError } from "../../../../../core/shared/api/api.responseTypes";
import { ActivateCategorySuccessResponseDTO, mapActivateCategoryError } from "./models/activateCategory.api";
import { CreateCategoryRequestDTO, CreateCategorySuccessResponseDTO, mapCreateCategoryError } from "./models/createCategory.api";
import { DeactivateCategorySuccessResponseDTO, mapDeactivateCategoryError } from "./models/deactivateCategory.api";
import { DisableCategoryFilterSuccessResponseDTO, mapDisableCategoryFilterError } from "./models/disableCategoryFilter.api";
import { EnableCategoryFilterSuccessResponseDTO, mapEnableCategoryFilterError } from "./models/enableCategoryFilter.api";
import { GetCategoriesSuccessResponseDTO, mapGetCategoriesError } from "./models/getCategories.api";
import { SearchFiltersRequestDTO, SearchFiltersSuccessResponseDTO, mapSearchFiltersError } from "./models/searchFilters.api";
import { GetCategoryFiltersSuccessResponseDTO, mapGetCategoryFiltersError } from "./models/getCategoryFilters.api";
import { UpdateCategoryRequestDTO, UpdateCategorySuccessResponseDTO, mapUpdateCategoryError } from "./models/updateCategory.api";
import { GetLightCategoriesSuccessResponseDTO, mapGetLightCategoriesError } from "./models/getCategoriesLight.api";






@Injectable()
export class CategoriesAdapter implements CategoriesPort {
  constructor(private readonly http: HttpClient) {}

  createCategory(body: CreateCategoryRequestDTO): Observable<CreateCategorySuccessResponseDTO> {
    return this.http.post<CreateCategorySuccessResponseDTO>("http://127.0.0.1:8000/api/v1/admin/categories/create", body).pipe(
      catchError((error: unknown) => {
        const apiError: ApiError = normolizeToApiError(error);
        const apiException: ApiException = mapCreateCategoryError(apiError);
        throw apiException;
      }),
    );
  }

  getCategories(): Observable<GetCategoriesSuccessResponseDTO> {
    return this.http.get<GetCategoriesSuccessResponseDTO>("http://127.0.0.1:8000/api/v1/admin/categories").pipe(
      catchError((error: unknown) => {
        const apiError: ApiError = normolizeToApiError(error);
        const apiException: ApiException = mapGetCategoriesError(apiError);
        throw apiException;
      }),
    );
  }

  updateCategory(categoryId: number, body: UpdateCategoryRequestDTO): Observable<UpdateCategorySuccessResponseDTO> {
    return this.http.patch<UpdateCategorySuccessResponseDTO>(`http://127.0.0.1:8000/api/v1/admin/categories/${categoryId}`, body).pipe(
      catchError((error: unknown) => {
        const apiError: ApiError = normolizeToApiError(error);
        const apiException: ApiException = mapUpdateCategoryError(apiError);
        throw apiException;
      }),
    );
  }

  enableCategoryFilter(categoryId: number, filterId: number): Observable<EnableCategoryFilterSuccessResponseDTO> {
    return this.http.post<EnableCategoryFilterSuccessResponseDTO>(`http://127.0.0.1:8000/api/v1/admin/categories/${categoryId}/filters/${filterId}/enable`, {}).pipe(
      catchError((error: unknown) => {
        const apiError: ApiError = normolizeToApiError(error);
        const apiException: ApiException = mapEnableCategoryFilterError(apiError);
        throw apiException;
      }),
    );
  }

  disableCategoryFilter(categoryId: number, filterId: number): Observable<DisableCategoryFilterSuccessResponseDTO> {
    return this.http.delete<DisableCategoryFilterSuccessResponseDTO>(`http://127.0.0.1:8000/api/v1/admin/categories/${categoryId}/filters/${filterId}/disable`, {}).pipe(
      catchError((error: unknown) => {
        const apiError: ApiError = normolizeToApiError(error);
        const apiException: ApiException = mapDisableCategoryFilterError(apiError);
        throw apiException;
      }),
    );
  }

  activateCategory(categoryId: number): Observable<ActivateCategorySuccessResponseDTO> {
    return this.http.patch<ActivateCategorySuccessResponseDTO>(`http://127.0.0.1:8000/api/v1/admin/categories/${categoryId}/activate`, {}).pipe(
      catchError((error: unknown) => {
        const apiError: ApiError = normolizeToApiError(error);
        const apiException: ApiException = mapActivateCategoryError(apiError);
        throw apiException;
      }),
    );
  }

  deactivateCategory(categoryId: number): Observable<DeactivateCategorySuccessResponseDTO> {
    return this.http.patch<DeactivateCategorySuccessResponseDTO>(`http://127.0.0.1:8000/api/v1/admin/categories/${categoryId}/deactivate`, {}).pipe(
      catchError((error: unknown) => {
        const apiError: ApiError = normolizeToApiError(error);
        const apiException: ApiException = mapDeactivateCategoryError(apiError);
        throw apiException;
      }),
    );
  }

  searchFilters(body: SearchFiltersRequestDTO): Observable<SearchFiltersSuccessResponseDTO> {
    return this.http.post<SearchFiltersSuccessResponseDTO>("http://127.0.0.1:8000/api/v1/admin/filters/search", body).pipe(
      catchError((error: unknown) => {
        const apiError: ApiError = normolizeToApiError(error);
        const apiException: ApiException = mapSearchFiltersError(apiError);
        throw apiException;
      }),
    );
  }


  // get filters (and their values) associated with a specific category
  getCategoryFiltersWithMetadata(categoryId: number): Observable<GetCategoryFiltersSuccessResponseDTO> {
    return this.http.get<GetCategoryFiltersSuccessResponseDTO>(`http://127.0.0.1:8000/api/v1/admin/categories/${categoryId}/filters`).pipe(
      catchError((error: unknown) => {
        const apiError: ApiError = normolizeToApiError(error);
        const apiException: ApiException = mapGetCategoryFiltersError(apiError);
        throw apiException;
      }),
    );
  }




  getLightCategories(): Observable<GetLightCategoriesSuccessResponseDTO> {
      return this.http.get<GetLightCategoriesSuccessResponseDTO>(`http://127.0.0.1:8000/api/v1/admin/categories/light`).pipe(
        catchError((error: unknown) => {
          const apiError: ApiError = normolizeToApiError(error);
          const apiException: ApiException = mapGetLightCategoriesError(apiError);
          throw apiException;
        }),
      );
    }
}
