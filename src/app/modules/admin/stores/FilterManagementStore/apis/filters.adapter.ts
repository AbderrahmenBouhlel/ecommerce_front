import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError } from "rxjs";
import { ApiError , ApiException, normolizeToApiError } from "../../../../../core/shared/api/api.responseTypes";
import { ActivateFilterSuccessResponseDTO, mapActivateFilterError } from "./models/filter/activateFilter.api";
import { CreateFilterRequestDTO, CreateFilterSuccessResponseDTO, mapCreateFilterError } from "./models/filter/createFilter.api";
import { DeactivateFilterSuccessResponseDTO, mapDeactivateFilterError } from "./models/filter/deactivateFilter.api";
import { GetFiltersSuccessResponseDTO, mapGetFiltersError } from "./models/filter/getFilters.api";
import { UpdateFilterRequestBodyDTO, UpdateFilterSuccessResponseDTO, mapUpdateFilterError } from "./models/filter/updateFilter.api";
import { FiltersPort } from "./filters.port";
import { ActivateFilterValueSuccessResponseDTO, mapActivateFilterValueError } from "./models/filter-value/activateFilterValue.api";
import {
  CreateFilterValueRequestDTO,
  CreateFilterValueSuccessResponseDTO,
  mapCreateFilterValueError,
} from "./models/filter-value/createFilterValue.api";
import { DeactivateFilterValueSuccessResponseDTO, mapDeactivateFilterValueError } from "./models/filter-value/deactivateFilterValue.api";
import { DeleteFilterValueSuccessResponseDTO, mapDeleteFilterValueError } from "./models/filter-value/deleteFilterValue.api";

@Injectable()
export class FiltersAdapter implements FiltersPort {
  constructor(private readonly http: HttpClient) {}

  getFilters(): Observable<GetFiltersSuccessResponseDTO> {
    return this.http.get<GetFiltersSuccessResponseDTO>("http://127.0.0.1:8000/api/v1/admin/filters").pipe(
      catchError((error: unknown) => {
        const apiError: ApiError = normolizeToApiError(error);
        const apiException: ApiException = mapGetFiltersError(apiError);
        throw apiException;
      })
    );
  }

  createFilter(body: CreateFilterRequestDTO): Observable<CreateFilterSuccessResponseDTO> {
    return this.http.post<CreateFilterSuccessResponseDTO>("http://127.0.0.1:8000/api/v1/admin/filters/create", body).pipe(
      catchError((error: unknown) => {
        const apiError: ApiError = normolizeToApiError(error);
        const apiException: ApiException = mapCreateFilterError(apiError);
        throw apiException;
      })
    );
  }

  deactivateFilter(filterId: number): Observable<DeactivateFilterSuccessResponseDTO> {
    return this.http.patch<DeactivateFilterSuccessResponseDTO>(`http://127.0.0.1:8000/api/v1/admin/filters/${filterId}/deactivate`, {}).pipe(
      catchError((error: unknown) => {
        const apiError: ApiError = normolizeToApiError(error);
        const apiException: ApiException = mapDeactivateFilterError(apiError);
        throw apiException;
      })
    );
  }

  activateFilter(filterId: number): Observable<ActivateFilterSuccessResponseDTO> {
    return this.http.patch<ActivateFilterSuccessResponseDTO>(`http://127.0.0.1:8000/api/v1/admin/filters/${filterId}/activate`, {}).pipe(
      catchError((error: unknown) => {
        const apiError: ApiError = normolizeToApiError(error);
        const apiException: ApiException = mapActivateFilterError(apiError);
        throw apiException;
      })
    );
  }

  updateFilter(filterId: number, body: UpdateFilterRequestBodyDTO): Observable<UpdateFilterSuccessResponseDTO> {
    return this.http.patch<UpdateFilterSuccessResponseDTO>(`http://127.0.0.1:8000/api/v1/admin/filters/${filterId}`, body).pipe(
      catchError((error: unknown) => {
        const apiError: ApiError = normolizeToApiError(error);
        const apiException: ApiException = mapUpdateFilterError(apiError);
        throw apiException;
      })
    );
  }

  createFilterValue(filterId: number, body: CreateFilterValueRequestDTO): Observable<CreateFilterValueSuccessResponseDTO> {
    return this.http.post<CreateFilterValueSuccessResponseDTO>(`http://127.0.0.1:8000/api/v1/admin/filters/${filterId}/values`, body).pipe(
      catchError((error: unknown) => {
        const apiError: ApiError = normolizeToApiError(error);
        const apiException: ApiException = mapCreateFilterValueError(apiError);
        throw apiException;
      })
    );
  }



  deactivateFilterValue(filterValueId: number): Observable<DeactivateFilterValueSuccessResponseDTO> {
    return this.http
      .patch<DeactivateFilterValueSuccessResponseDTO>(
        `http://127.0.0.1:8000/api/v1/admin/filter-values/${filterValueId}/deactivate`,
        {}
      )
      .pipe(
        catchError((error: unknown) => {
          const apiError: ApiError = normolizeToApiError(error);
          const apiException: ApiException = mapDeactivateFilterValueError(apiError);
          throw apiException;
        })
      );
  }

  activateFilterValue(filterValueId: number): Observable<ActivateFilterValueSuccessResponseDTO> {
    return this.http
      .patch<ActivateFilterValueSuccessResponseDTO>(
        `http://127.0.0.1:8000/api/v1/admin/filter-values/${filterValueId}/activate`,
        {}
      )
      .pipe(
        catchError((error: unknown) => {
          const apiError: ApiError = normolizeToApiError(error);
          const apiException: ApiException = mapActivateFilterValueError(apiError);
          throw apiException;
        })
      );
  }

  deleteFilterValue(filterValueId: number, confirm: boolean): Observable<DeleteFilterValueSuccessResponseDTO> {
    return this.http
      .delete<DeleteFilterValueSuccessResponseDTO>(
        `http://127.0.0.1:8000/api/v1/admin/filter-values/${filterValueId}/delete`,
        { params: { confirm: confirm.toString() } }
      )
      .pipe(
        catchError((error: unknown) => {
          const apiError: ApiError = normolizeToApiError(error);
          const apiException: ApiException = mapDeleteFilterValueError(apiError);
          throw apiException;
        })
      );
  }
}
