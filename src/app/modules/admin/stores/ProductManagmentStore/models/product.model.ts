export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface ProductVariant {
  id: string | number;
  product_id: number;
  color_name: string;
  color_code: string;
  createdAt: string;
}

export type SelectableCategoryGender = "MALE" | "FEMALE";

export interface SelectableCategory {
  id: number;
  name: string;
  gender: SelectableCategoryGender;
  isActive: boolean;
}

export interface Product {
  id: number;
  status: ProductStatus;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  createdAt: string;
  updatedAt?: string;
  variants: ProductVariant[];
}

// DTOs from API
export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  categoryId: number;
}

export interface CreateProductVariantDTO {
  color_name: string;
  color_code: string;
}

export interface ProductDTO {
  id: number;
  status: ProductStatus;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductVariantDTO {
  id: string | number;
  product_id: number;
  color_name: string;
  color_code: string;
  createdAt: string;
}

// Mappers
export function mapProductDTOToProduct(dto: ProductDTO, variants: ProductVariant[] = []): Product {
  return {
    id: dto.id,
    status: dto.status,
    name: dto.name,
    description: dto.description,
    price: dto.price,
    categoryId: dto.categoryId,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    variants,
  };
}

export function mapProductVariantDTOToProductVariant(dto: ProductVariantDTO): ProductVariant {
  return {
    id: dto.id,
    product_id: dto.product_id,
    color_name: dto.color_name,
    color_code: dto.color_code,
    createdAt: dto.createdAt,
  };
}

export interface SelectableCategoryDTO {
  id: number;
  name: string;
  gender: SelectableCategoryGender;
  isActive: boolean;
}

export function mapSelectableCategoryDTOToSelectableCategory(dto: SelectableCategoryDTO): SelectableCategory {
  return {
    id: dto.id,
    name: dto.name,
    gender: dto.gender,
    isActive: dto.isActive,
  };
}
