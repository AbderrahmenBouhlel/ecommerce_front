import { Observable } from "rxjs";
import { CreateProductRequestDTO, CreateProductSuccessResponseDTO } from "./models/createProduct.api";
import { CreateProductVariantRequestDTO, CreateProductVariantSuccessResponseDTO } from "./models/createProductVariant.api";
import { GetSelectableCategoriesSuccessResponseDTO } from "./models/getSelectableCategories.api";

export interface ProductsPort {
  createProduct(body: CreateProductRequestDTO): Observable<CreateProductSuccessResponseDTO>;
  createProductVariant(productId: number, body: CreateProductVariantRequestDTO): Observable<CreateProductVariantSuccessResponseDTO>;
  getSelectableCategories(): Observable<GetSelectableCategoriesSuccessResponseDTO>;
}
