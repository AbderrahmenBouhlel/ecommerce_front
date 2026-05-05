import { Observable } from "rxjs";
import { ActivateFilterSuccessResponseDTO } from "./models/filter/activateFilter.api";
import { CreateFilterRequestDTO, CreateFilterSuccessResponseDTO } from "./models/filter/createFilter.api";
import { DeactivateFilterSuccessResponseDTO } from "./models/filter/deactivateFilter.api";
import { GetFiltersSuccessResponseDTO } from "./models/filter/getFilters.api";
import { UpdateFilterRequestBodyDTO, UpdateFilterSuccessResponseDTO } from "./models/filter/updateFilter.api";
import { ActivateFilterValueSuccessResponseDTO } from "./models/filter-value/activateFilterValue.api";
import { CreateFilterValueRequestDTO, CreateFilterValueSuccessResponseDTO } from "./models/filter-value/createFilterValue.api";
import { DeactivateFilterValueSuccessResponseDTO } from "./models/filter-value/deactivateFilterValue.api";
import { DeleteFilterValueSuccessResponseDTO } from "./models/filter-value/deleteFilterValue.api";

export interface FiltersPort {
  getFilters(): Observable<GetFiltersSuccessResponseDTO>;
  createFilter(body: CreateFilterRequestDTO): Observable<CreateFilterSuccessResponseDTO>;
  deactivateFilter(filterId: number): Observable<DeactivateFilterSuccessResponseDTO>;
  activateFilter(filterId: number): Observable<ActivateFilterSuccessResponseDTO>;
  updateFilter(filterId: number, body: UpdateFilterRequestBodyDTO): Observable<UpdateFilterSuccessResponseDTO>;
  
  
  
  createFilterValue(filterId: number, body: CreateFilterValueRequestDTO): Observable<CreateFilterValueSuccessResponseDTO>;
  deactivateFilterValue(filterValueId: number): Observable<DeactivateFilterValueSuccessResponseDTO>;
  activateFilterValue(filterValueId: number): Observable<ActivateFilterValueSuccessResponseDTO>;
  deleteFilterValue(filterValueId: number, confirm: boolean): Observable<DeleteFilterValueSuccessResponseDTO>;
}
