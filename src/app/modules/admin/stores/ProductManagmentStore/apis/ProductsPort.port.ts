import { Observable } from "rxjs";
import { CreateProductRequestDTO, CreateProductSuccessResponseDTO } from "./models/createProduct.api";
import { CreateProductVariantRequestDTO, CreateProductVariantSuccessResponseDTO } from "./models/createProductVariant.api";
import { GetSelectableCategoriesSuccessResponseDTO } from "./models/getSelectableCategories.api";
import { CreateProductVariantSkusRequestDTO, CreateProductVariantSkusSuccessResponseDTO } from "./models/createProductVariantSkus.api";
import { CreateProductFilterValuesRequestDTO, CreateProductFilterValuesSuccessResponseDTO } from "./models/createProductFilterValues.api";

export interface ProductsPort {
  createProduct(body: CreateProductRequestDTO): Observable<CreateProductSuccessResponseDTO>;
  createProductVariant(productId: number, body: CreateProductVariantRequestDTO): Observable<CreateProductVariantSuccessResponseDTO>;
  createProductVariantSkus(variantId: number, body: CreateProductVariantSkusRequestDTO): Observable<CreateProductVariantSkusSuccessResponseDTO>;
  getSelectableCategories(): Observable<GetSelectableCategoriesSuccessResponseDTO>;
  createProductFilterValues(productId: number, body: CreateProductFilterValuesRequestDTO): Observable<CreateProductFilterValuesSuccessResponseDTO>;
}
