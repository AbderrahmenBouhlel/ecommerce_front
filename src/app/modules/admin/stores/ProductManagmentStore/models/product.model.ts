import { CreateProductDataDTO } from "../apis/models/createProduct.api";
import { CreateProductVariantDataDTO } from "../apis/models/createProductVariant.api";
import { ProductFilterValueDataDTO } from "../apis/models/createProductFilterValues.api";


    
export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";



export interface Product {
  id: number;
  status: ProductStatus;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  createdAt: string;
  updatedAt?: string;
  filterValues: ProductFilterValue[];
  variants: ProductVariant[];
}



export interface VariantImage {
  id: number;
  image_url: string;
  order: number;
}

export interface VariantSku {
  id: number;
  size: string;
  stock: number;
}

export interface ProductFilterValue {
  id: string;
  productId: number;
  filterValueId: number;
  name: string;
}



export interface ProductVariant {
  id:  number;
  product_id: number;
  color_name: string;
  color_code: string;
  images: VariantImage[];
  createdAt: string;
  skus: VariantSku[];
}






// Mappers
export function mapCreateProductDTOToProduct(dto: CreateProductDataDTO, variants: ProductVariant[] = []): Product {
  return {
    id: dto.id,
    status: dto.status,
    name: dto.name,
    description: dto.description,
    price: dto.price,
    categoryId: dto.categoryId,
    createdAt: dto.createdAt,
    filterValues: [],
    variants,
  };
}

export function mapCreateProductVariantDTOToProductVariant(dto: CreateProductVariantDataDTO, images: VariantImage[] = []): ProductVariant {
  return {
    id: dto.id,
    product_id: dto.product_id,
    color_name: dto.color_name,
    color_code: dto.color_code,
    images: dto.images ?? images,
    createdAt: dto.created_at,
    skus: [],
  };
}

export function mapProductFilterValueDTOToProductFilterValue(dto: ProductFilterValueDataDTO): ProductFilterValue {
  return {
    id: dto.id,
    productId: dto.product_id,
    filterValueId: dto.filter_value_id,
    name: dto.filter_value_name,
  };
}

