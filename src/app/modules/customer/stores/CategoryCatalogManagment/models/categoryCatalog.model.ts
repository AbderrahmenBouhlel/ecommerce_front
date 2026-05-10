import {
  CategoryCatalogDataDTO,
  CategoryCatalogFilterValueDTO,
  CategoryCatalogProductDTO,
} from "../apis/models/getCategoryCatalog.api";

export interface CategoryCatalogProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  coverImageUrl: string;
  hoverImageUrl: string;
  isActive: boolean;
  filterValues: CategoryCatalogFilterValue[];
}

export interface CategoryCatalogFilterValue {
  id: number;
  name: string;
  slug: string;
}

export interface CategoryCatalog {
  products: CategoryCatalogProduct[];
  filterValues: CategoryCatalogFilterValue[];
}






export function mapCatalogProductDTOToCatalogProduct(
  dto: CategoryCatalogProductDTO,
): CategoryCatalogProduct {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    price: dto.price,
    coverImageUrl: dto.cover_image_url,
    hoverImageUrl: dto.hover_image_url,
    isActive: dto.is_active,
    filterValues: dto.filter_values.map((item) => mapCatalogFilterValueDTOToCatalogFilterValue(item)),
  };
}

export function mapCatalogFilterValueDTOToCatalogFilterValue(
  dto: CategoryCatalogFilterValueDTO,
): CategoryCatalogFilterValue {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
  };
}

export function mapGetCategoryCatalogDataDTOToCategoryCatalog(dto: CategoryCatalogDataDTO): CategoryCatalog {
  return {
    products: dto.products.map((item) => mapCatalogProductDTOToCatalogProduct(item)),
    filterValues: dto.filter_values.map((item) => mapCatalogFilterValueDTOToCatalogFilterValue(item)),
  };
}