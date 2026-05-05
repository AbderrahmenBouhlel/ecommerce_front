import { Inject, Injectable, InjectionToken, signal } from "@angular/core";
import { ApiException } from "../../../../core/shared/api/api.responseTypes";
import { LoadState } from "../../../../core/shared/state/load-state";
import { Observable, catchError, map } from "rxjs";
import { CategoriesPort } from "./apis/CategoriesPort.port";
import { ActivateCategorySuccessResponseDTO } from "./apis/models/activateCategory.api";
import { CreateCategorySuccessResponseDTO } from "./apis/models/createCategory.api";
import { DeactivateCategorySuccessResponseDTO } from "./apis/models/deactivateCategory.api";
import { DisableCategoryFilterSuccessResponseDTO } from "./apis/models/disableCategoryFilter.api";
import { EnableCategoryFilterSuccessResponseDTO } from "./apis/models/enableCategoryFilter.api";
import { CategoryDTO, GetCategoriesSuccessResponseDTO } from "./apis/models/getCategories.api";
import { SearchFiltersRequestDTO, SearchFiltersSuccessResponseDTO } from "./apis/models/searchFilters.api";
import { Category, CategoryGender, mapCategoryDTOToCategory, mapCreateCategoryDTOToCategory, mapSearchFilterDTOToAllowedFilter, mapUpdateCategoryDTOToCategory } from "./models/Category.model";
import { CategoryState } from "./state/category.state";
import { AllowedFilter } from "./models/Category.model";
import { UpdateCategoryRequestDTO, UpdateCategorySuccessResponseDTO } from "./apis/models/updateCategory.api";



export const CATEGORIES_PORT = new InjectionToken<CategoriesPort>("CATEGORIES_PORT");


@Injectable()
export class CategoriesStore {
  private readonly categoriesState = signal<CategoryState>({ items: [] });
  private readonly loadState = signal<LoadState>({ status: "idle" });

  readonly categoriesState$ = this.categoriesState.asReadonly();
  readonly loadingState$ = this.loadState.asReadonly();

  constructor(@Inject(CATEGORIES_PORT) private readonly categoriesPort: CategoriesPort) {}

  loadCategories(): Observable<Category[]> {
    this.loadState.set({ status: "loading" });

    return this.categoriesPort.getCategories().pipe(
      map((response: GetCategoriesSuccessResponseDTO) => {
        const items = response.data.map((item: CategoryDTO) => mapCategoryDTOToCategory(item));
        this.categoriesState.set({ items });
        this.loadState.set({ status: "success" });
        return items;
      }),
      catchError((err: ApiException) => {
        this.loadState.set({ status: "error", error: err.message });
        throw err;
      }),
    );
  }

  createCategory(name: string, gender: CategoryGender, description: string): Observable<Category> {
    return this.categoriesPort.createCategory({ name, gender, description }).pipe(
      map((response: CreateCategorySuccessResponseDTO) => {
        const createdCategory = mapCreateCategoryDTOToCategory(response.data);

        this.setCategories([...this.categoriesState().items, createdCategory]);

        return createdCategory;
      }),
    );
  }

  updateCategory(categoryId: number, body: UpdateCategoryRequestDTO): Observable<Category | undefined> {
    return this.categoriesPort.updateCategory(categoryId, body).pipe(
      map((response: UpdateCategorySuccessResponseDTO) => {
        let updatedCategory: Category| undefined = undefined;
        
        const updatedItems = this.categoriesState().items.map((item: Category) => {
          if (item.id !== response.data.id) {
            return item;
          }

          updatedCategory = mapUpdateCategoryDTOToCategory(response.data, item.allowedFilters);
          return updatedCategory;
        });

        this.setCategories(updatedItems);
        return updatedCategory;
      }),
    );
  }

  enableCategoryFilter(categoryId: number, filter: AllowedFilter): Observable<Category | undefined> {
    return this.categoriesPort.enableCategoryFilter(categoryId, filter.id).pipe(
      map((response: EnableCategoryFilterSuccessResponseDTO) => {
        const updatedCategoryId = response.data.categoryId;
        let updatedCategory: Category | undefined = undefined;

        const updatedItems = this.categoriesState().items.map((item: Category) => {
          if (item.id !== updatedCategoryId) {
            return item;
          }

          const alreadyEnabled = item.allowedFilters.some((allowedFilter) => allowedFilter.id === filter.id);
          updatedCategory = {
            ...item,
            allowedFilters: alreadyEnabled ? item.allowedFilters : [...item.allowedFilters, filter],
          };

          return updatedCategory;
        });

        this.setCategories(updatedItems);
        return updatedCategory;
      }),
    );
  }

  disableCategoryFilter(categoryId: number, filterId: number): Observable<Category | undefined> {
    return this.categoriesPort.disableCategoryFilter(categoryId, filterId).pipe(
      map((response: DisableCategoryFilterSuccessResponseDTO) => {
        const updatedCategoryId = response.data.categoryId;
        let updatedCategory: Category | undefined = undefined;

        const updatedItems = this.categoriesState().items.map((item: Category) => {
          if (item.id !== updatedCategoryId) {
            return item;
          }

          updatedCategory = {
            ...item,
            allowedFilters: item.allowedFilters.filter((allowedFilter) => allowedFilter.id !== filterId),
          };

          return updatedCategory;
        });

        this.setCategories(updatedItems);
        return updatedCategory;
      }),
    );
  }

  deactivateCategory(categoryId: number): Observable<Category | undefined> {
    return this.categoriesPort.deactivateCategory(categoryId).pipe(
      map((response: DeactivateCategorySuccessResponseDTO) => {
        const updatedCategoryId = response.data.categoryId;
        const updatedItems = this.categoriesState().items.map((item: Category) => {
          if (item.id !== updatedCategoryId) {
            return item;
          }

          return {
            ...item,
            isActive: false,
          };
        });

        this.setCategories(updatedItems);
        return updatedItems.find((item) => item.id === updatedCategoryId);
      }),
    );
  }

  activateCategory(categoryId: number): Observable<Category | undefined> {
    return this.categoriesPort.activateCategory(categoryId).pipe(
      map((response: ActivateCategorySuccessResponseDTO) => {
        const updatedCategoryId = response.data.categoryId;
        const updatedItems = this.categoriesState().items.map((item: Category) => {
          if (item.id !== updatedCategoryId) {
            return item;
          }

          return {
            ...item,
            isActive: true,
          };
        });

        this.setCategories(updatedItems);
        return updatedItems.find((item) => item.id === updatedCategoryId);
      }),
    );
  }

  toggleCategoryStatus(category: Category): Observable<Category | undefined> {
    if (category.isActive) {
      return this.deactivateCategory(category.id);
    }

    return this.activateCategory(category.id);
  }

  searchFilters(q: string, excludedIds: number[] = []): Observable<AllowedFilter[]> {

    const requestBody: SearchFiltersRequestDTO = {
      q,
      excludedIds
    };
    return this.categoriesPort.searchFilters(requestBody).pipe(
      map((response: SearchFiltersSuccessResponseDTO) =>{
        return response.data.map((item) => mapSearchFilterDTOToAllowedFilter(item));
      }),
    );
  }

  setCategories(items: Category[]): void {
    this.categoriesState.set({ items });
  }

}
