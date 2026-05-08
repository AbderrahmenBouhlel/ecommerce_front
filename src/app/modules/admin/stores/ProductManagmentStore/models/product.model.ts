import { CreateProductDataDTO } from "../apis/models/createProduct.api";
import { CreateProductVariantDataDTO } from "../apis/models/createProductVariant.api";


    
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
  variants: ProductVariant[];
}



export interface VariantImage {
  id: number;
  image_url: string;
  order: number;
}



export interface ProductVariant {
  id:  number;
  product_id: number;
  color_name: string;
  color_code: string;
  images: VariantImage[];
  createdAt: string;
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
    createdAt: dto.createdAt,
  };
}

