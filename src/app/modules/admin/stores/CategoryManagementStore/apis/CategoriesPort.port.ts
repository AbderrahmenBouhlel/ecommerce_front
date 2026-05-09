
import { Observable } from "rxjs";
import { ActivateCategorySuccessResponseDTO } from "./models/activateCategory.api";
import { CreateCategoryRequestDTO, CreateCategorySuccessResponseDTO } from "./models/createCategory.api";
import { DeactivateCategorySuccessResponseDTO } from "./models/deactivateCategory.api";
import { DisableCategoryFilterSuccessResponseDTO } from "./models/disableCategoryFilter.api";
import { EnableCategoryFilterSuccessResponseDTO } from "./models/enableCategoryFilter.api";
import { GetCategoriesSuccessResponseDTO } from "./models/getCategories.api";
import { SearchFiltersRequestDTO, SearchFiltersSuccessResponseDTO } from "./models/searchFilters.api";
import { GetCategoryFiltersSuccessResponseDTO } from "./models/getCategoryFilters.api";
import { UpdateCategoryRequestDTO, UpdateCategorySuccessResponseDTO } from "./models/updateCategory.api";
import { GetLightCategoriesSuccessResponseDTO } from "./models/getCategoriesLight.api";

export interface CategoriesPort {
	createCategory(body: CreateCategoryRequestDTO): Observable<CreateCategorySuccessResponseDTO>;
	getCategories(): Observable<GetCategoriesSuccessResponseDTO>;
	updateCategory(categoryId: number, body: UpdateCategoryRequestDTO): Observable<UpdateCategorySuccessResponseDTO>;
	enableCategoryFilter(categoryId: number, filterId: number): Observable<EnableCategoryFilterSuccessResponseDTO>;
	disableCategoryFilter(categoryId: number, filterId: number): Observable<DisableCategoryFilterSuccessResponseDTO>;
	activateCategory(categoryId: number): Observable<ActivateCategorySuccessResponseDTO>;
	deactivateCategory(categoryId: number): Observable<DeactivateCategorySuccessResponseDTO>;
	searchFilters(body: SearchFiltersRequestDTO): Observable<SearchFiltersSuccessResponseDTO>;
	getCategoryFiltersWithMetadata(categoryId: number): Observable<GetCategoryFiltersSuccessResponseDTO>;


	getLightCategories(): Observable<GetLightCategoriesSuccessResponseDTO>;
}
