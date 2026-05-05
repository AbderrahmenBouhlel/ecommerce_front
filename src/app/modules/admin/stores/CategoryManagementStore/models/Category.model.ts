import { CreateCategoryDTO } from "../apis/models/createCategory.api";
import { UpdateCategoryDTO } from "../apis/models/updateCategory.api";
import { AllowedFilterDTO, CategoryDTO } from "../apis/models/getCategories.api";
import { SearchFilterDTO } from "../apis/models/searchFilters.api";

export type CategoryGender = "MALE" | "FEMALE";

export interface AllowedFilter {
	id: number;
	name: string;
	slug: string;
	description: string;
	isActive: boolean;
	createdAt: string;
}

export interface Category {
	id: number;
	name: string;
	gender: CategoryGender;
	slug: string;
	description: string;
	isActive: boolean;
	createdAt: string;
	updatedAt?: string;
	allowedFilters: AllowedFilter[];
}

export interface CategorySearchFilter {
	id: number;
	name: string;
	slug: string;
	description: string;
	isActive: boolean;
}

export function mapAllowedFilterDTOToAllowedFilter(dto: AllowedFilterDTO): AllowedFilter {
	return {
		id: dto.id,
		name: dto.name,
		slug: dto.slug,
		description: dto.description,
		isActive: dto.isActive,
		createdAt: dto.createdAt,
	};
}

export function mapSearchFilterDTOToAllowedFilter(dto: SearchFilterDTO): AllowedFilter {
	return {
		id: dto.id,
		name: dto.name,
		slug: dto.slug,
		description: dto.description,
		isActive: dto.isActive,
		createdAt: "",
	};
}




export function mapCategoryDTOToCategory(dto: CategoryDTO): Category {
	return {
		id: dto.id,
		name: dto.name,
		gender: dto.gender,
		slug: dto.slug,
		description: dto.description,
		isActive: dto.isActive,
		createdAt: dto.createdAt,
		allowedFilters: dto.allowedFilters.map(mapAllowedFilterDTOToAllowedFilter),
	};
}

export function mapCreateCategoryDTOToCategory(dto: CreateCategoryDTO): Category {
	return {
		id: dto.id,
		name: dto.name,
		gender: dto.gender,
		slug: dto.slug,
		description: dto.description,
		isActive: dto.isActive,
		createdAt: dto.createdAt,
		allowedFilters: [],
	};
}

export function mapUpdateCategoryDTOToCategory(dto: UpdateCategoryDTO, allowedFilters: AllowedFilter[]): Category {
	return {
		id: dto.id,
		name: dto.name,
		gender: dto.gender,
		slug: dto.slug,
		description: dto.description,
		isActive: dto.isActive,
		createdAt:dto.createdAt,
		updatedAt: dto.updatedAt,
		allowedFilters,
	};
}
