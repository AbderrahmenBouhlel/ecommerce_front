import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError } from "rxjs";
import { ApiError, ApiException, normolizeToApiError } from "../../../../../core/shared/api/api.responseTypes";
import { CategoryCatalogPort } from "./CategoryCatalogPort.port";
import { GetCategoryCatalogSuccessResponseDTO, mapGetCategoryCatalogError } from "./models/getCategoryCatalog.api";

@Injectable()
export class CategoryCatalogAdapter implements CategoryCatalogPort {
  private readonly baseUrl = "http://127.0.0.1:8000/api/v1/products/categories";

  constructor(private readonly http: HttpClient) {}

  getCategoryCatalog(categorySlug: string): Observable<GetCategoryCatalogSuccessResponseDTO> {
    const encodedCategorySlug = encodeURIComponent(categorySlug);

    return this.http
      .get<GetCategoryCatalogSuccessResponseDTO>(`${this.baseUrl}/${encodedCategorySlug}/catalog`, {
        headers: { Accept: "application/json" },
      })
      .pipe(
        catchError((error: unknown) => {
          const apiError: ApiError = normolizeToApiError(error);
          const apiException: ApiException = mapGetCategoryCatalogError(apiError);
          throw apiException;
        }),
      );
  }
}