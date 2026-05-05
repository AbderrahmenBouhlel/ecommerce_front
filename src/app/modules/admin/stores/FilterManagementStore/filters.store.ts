import { Inject, Injectable, InjectionToken, signal } from "@angular/core";
import { ApiException } from "../../../../core/shared/api/api.responseTypes";
import { LoadState } from "../../../../core/shared/state/load-state";
import { FiltersPort } from "./apis/filters.port";
import { Filter, FilterValue, mapCreateFilterDTOToFilter, mapCreateFilterValueDTOToFilterValue, mapFilterDTOToFilter, mapUpdateFilterDTOToFilter } from "./models/filter.model";
import { FiltersState } from "./state/filters.state";
import { ActivateFilterSuccessResponseDTO } from "./apis/models/filter/activateFilter.api";
import { CreateFilterSuccessResponseDTO } from "./apis/models/filter/createFilter.api";
import { DeactivateFilterSuccessResponseDTO } from "./apis/models/filter/deactivateFilter.api";
import { Observable , map,catchError } from "rxjs";
import { FilterDTO, GetFiltersSuccessResponseDTO } from "./apis/models/filter/getFilters.api";
import { UpdateFilterRequestBodyDTO, UpdateFilterSuccessResponseDTO } from "./apis/models/filter/updateFilter.api";
import { ActivateFilterValueSuccessResponseDTO } from "./apis/models/filter-value/activateFilterValue.api";
import { CreateFilterValueSuccessResponseDTO } from "./apis/models/filter-value/createFilterValue.api";
import { DeactivateFilterValueSuccessResponseDTO } from "./apis/models/filter-value/deactivateFilterValue.api";
import { DeleteFilterValueSuccessResponseDTO } from "./apis/models/filter-value/deleteFilterValue.api";


export const FILTERS_PORT = new InjectionToken<FiltersPort>("FILTERS_PORT");


@Injectable()
export class FiltersStore {
  private readonly filtersState = signal<FiltersState>({ items: [] });
  private readonly loadState = signal<LoadState>({ status: "idle" });

  readonly filtersState$ = this.filtersState.asReadonly();
  readonly loadingState$ = this.loadState.asReadonly();

  constructor(@Inject(FILTERS_PORT) private readonly filtersPort: FiltersPort) {}

  loadFilters(): Observable<Filter[]> {
    this.loadState.set({ status: "loading" });

    return this.filtersPort.getFilters().pipe(
      map((response: GetFiltersSuccessResponseDTO) => {
        const items = response.data.map((item: FilterDTO) => mapFilterDTOToFilter(item));
        this.filtersState.set({ items });
        this.loadState.set({ status: "success" });
        return items;
      }),
      catchError((err: ApiException) => {
        this.loadState.set({ status: "error", error: err.message });
        throw err;
      }),
    );
  }


  createFilter(name: string, description: string): Observable<Filter> {
    return this.filtersPort.createFilter({ name, description }).pipe(
      map((response: CreateFilterSuccessResponseDTO) => {
        const newFilterDto = response.data;
        const newFilter: Filter = mapCreateFilterDTOToFilter(newFilterDto);

        this.setFilters([...this.filtersState().items, newFilter]);

        return newFilter;
      })
    );
  }

  deactivateFilter(filterId: number): Observable<Filter | undefined> {
    return this.filtersPort.deactivateFilter(filterId).pipe(
      map((response: DeactivateFilterSuccessResponseDTO) => {
        const updatedFilterId = response.data.filterId;

        const updatedItems = this.filtersState().items.map((item) => {
          if (item.id !== updatedFilterId) {
            return item;
          }
          return {
            ...item,
            isActive: false,
            values: item.values.map((value) => ({
              ...value,
              isActive: false,
            })),
          };
        });
        this.setFilters(updatedItems);
        return updatedItems.find((item) => item.id === updatedFilterId);
      })
    );
  }

  activateFilter(filterId: number): Observable<Filter | undefined> {
    return this.filtersPort.activateFilter(filterId).pipe(
      map((response: ActivateFilterSuccessResponseDTO) => {
        const updatedFilterId = response.data.filterId;

        const updatedItems = this.filtersState().items.map((item) => {
          if (item.id !== updatedFilterId) {
            return item;
          }

          // Activating a filter does not reactivate its values (per endpoint contract).
          return {
            ...item,
            isActive: true,
          };
        });

        this.setFilters(updatedItems);

        return updatedItems.find((item) => item.id === updatedFilterId);
      })
    );
  }

  updateFilter(filterId: number, body: UpdateFilterRequestBodyDTO): Observable<Filter | undefined> {
    return this.filtersPort.updateFilter(filterId, body).pipe(
      map((response: UpdateFilterSuccessResponseDTO) => {
        console.log("Update filter response:", response);
        const existingFilter = this.filtersState().items.find((item) => item.id === response.data.id);
        const updatedFilter = mapUpdateFilterDTOToFilter(response.data, existingFilter);

        const updatedItems = this.filtersState().items.map((item) => {
          if (item.id !== updatedFilter.id) {
            return item;
          }

          return {
            ...item,
            ...updatedFilter,
          };
        });

        this.setFilters(updatedItems);

        return updatedItems.find((item) => item.id === updatedFilter.id);
      })
    );
  }

  toggleFilterStatus(filter: Filter): Observable<Filter | undefined> {
    if (filter.isActive) {
      return this.deactivateFilter(filter.id);
    } else {
      return this.activateFilter(filter.id);
    }
  }


  // FILTER VALUES OPERATIONS

  createFilterValue(filterId: number, name: string, description: string): Observable<FilterValue> {
    return this.filtersPort.createFilterValue(filterId, { name, description }).pipe(
      map((response: CreateFilterValueSuccessResponseDTO) => {
        const createdValue : FilterValue = mapCreateFilterValueDTOToFilterValue(response.data);

        const updatedItems = this.filtersState().items.map((item) => {
          if (item.id !== filterId) {
            return item;
          }

          return {
            ...item,
            values: [...item.values, createdValue],
          };
        });

        this.setFilters(updatedItems);

        return createdValue;
      })
    );
  }

  deactivateFilterValue(filterValueId: number): Observable<FilterValue | undefined> {
    return this.filtersPort.deactivateFilterValue(filterValueId).pipe(
      map((response: DeactivateFilterValueSuccessResponseDTO) => {
        let deactivatedValue: FilterValue | undefined = undefined;
        const updatedItems = this.filtersState().items.map((filter) => ({
          ...filter,
          values: filter.values.map((value) => {
            if (value.id !== filterValueId) {
              return value;
            }
            deactivatedValue = { ...value, isActive: false };
            return deactivatedValue;
          }),
        }));
        this.setFilters(updatedItems);
        return deactivatedValue;
      })
    );
  }

  activateFilterValue(filterValueId: number): Observable<FilterValue | undefined> {
    return this.filtersPort.activateFilterValue(filterValueId).pipe(
      map((response: ActivateFilterValueSuccessResponseDTO) => {
        let activatedValue: FilterValue | undefined = undefined;
        const updatedItems = this.filtersState().items.map((filter) => ({
          ...filter,
          values: filter.values.map((value) => {
            if (value.id !== filterValueId) {
              return value;
            }
            activatedValue = { ...value, isActive: true };
            return activatedValue;
          }),
        }));
        this.setFilters(updatedItems);
        return activatedValue;
      })
    );
  } 

  deleteFilterValue(filterValueId: number, confirm: boolean = true): Observable<void> {
    return this.filtersPort.deleteFilterValue(filterValueId, confirm).pipe(
      map((response: DeleteFilterValueSuccessResponseDTO) => {
        const updatedItems = this.filtersState().items.map((filter) => ({
          ...filter,
          values: filter.values.filter((value) => value.id !== filterValueId),
        }));
        this.setFilters(updatedItems);
      })
    );
  }

  toggleFilterValueStatus(filterValue: FilterValue): Observable<FilterValue | undefined> {
    if (filterValue.isActive) {
      return this.deactivateFilterValue(filterValue.id);
    } else {
      return this.activateFilterValue(filterValue.id);
    }
  }

  
  setFilters(items: Filter[]): void {
    this.filtersState.set({ items });
  }
}
