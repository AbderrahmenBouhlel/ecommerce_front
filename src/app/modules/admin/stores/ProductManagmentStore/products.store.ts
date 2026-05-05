import { Inject, Injectable, InjectionToken, signal } from "@angular/core";
import { ApiException } from "../../../../core/shared/api/api.responseTypes";
import { LoadState } from "../../../../core/shared/state/load-state";
import { Observable, catchError, map } from "rxjs";
import { ProductsPort } from "./apis/ProductsPort.port";
import { CreateProductSuccessResponseDTO } from "./apis/models/createProduct.api";
import { CreateProductVariantSuccessResponseDTO } from "./apis/models/createProductVariant.api";
import { GetSelectableCategoriesSuccessResponseDTO } from "./apis/models/getSelectableCategories.api";
import {
  Product,
  ProductVariant,
  SelectableCategory,
  mapSelectableCategoryDTOToSelectableCategory,
  mapProductDTOToProduct,
  mapProductVariantDTOToProductVariant,
  CreateProductDTO,
  CreateProductVariantDTO,
} from "./models/product.model";
import { ProductsState, SelectableCategoryState } from "./state/products.state";

export const PRODUCTS_PORT = new InjectionToken<ProductsPort>("PRODUCTS_PORT");


// Responsibility:

// backend communication
// products collection state
@Injectable({
  providedIn: 'root'
})
export class ProductsStore {
  private readonly productsState = signal<ProductsState>({ items: [] });
  private readonly selectableCategoriesState = signal<SelectableCategoryState>({ items: [] });
  private readonly loadState = signal<LoadState>({ status: "idle" });

  readonly productsState$ = this.productsState.asReadonly();
  readonly selectableCategoriesState$ = this.selectableCategoriesState.asReadonly();
  readonly loadingState$ = this.loadState.asReadonly();

  constructor(@Inject(PRODUCTS_PORT) private readonly productsPort: ProductsPort) {}

  createProduct(name: string, categoryId: number, price: number, description?: string): Observable<Product> {
    const productDto: CreateProductDTO = {
      name,
      description: description || "",
      price,
      categoryId,
    };

    return this.productsPort.createProduct(productDto).pipe(
      map((response: CreateProductSuccessResponseDTO) => {
        const createdProduct: Product = mapProductDTOToProduct(response.data);

        this.setProducts([...this.productsState().items, createdProduct]);

        return createdProduct;
      }),
      catchError((err: ApiException) => {
        this.loadState.set({ status: "error", error: err.message });
        throw err;
      }),
    );
  }

  createProductVariant(productId: number, colorName: string, colorCode: string): Observable<ProductVariant> {
    const variantDto: CreateProductVariantDTO = {
      color_name: colorName,
      color_code: colorCode,
    };

    return this.productsPort.createProductVariant(productId, variantDto).pipe(
      map((response: CreateProductVariantSuccessResponseDTO) => {
        const createdVariant: ProductVariant = mapProductVariantDTOToProductVariant(response.data);

        // Add variant to the product in state
        const updatedItems = this.productsState().items.map((item: Product) => {
          if (item.id !== productId) {
            return item;
          }

          return {
            ...item,
            variants: [...item.variants, createdVariant],
          };
        });

        this.setProducts(updatedItems);

        return createdVariant;
      }),
      catchError((err: ApiException) => {
        this.loadState.set({ status: "error", error: err.message });
        throw err;
      }),
    );
  }

  loadSelectableCategories(): Observable<SelectableCategory[]> {
    this.loadState.set({ status: "loading" });

    return this.productsPort.getSelectableCategories().pipe(
      map((response: GetSelectableCategoriesSuccessResponseDTO) => {
        const items = response.data.map((item) => mapSelectableCategoryDTOToSelectableCategory(item));
        this.selectableCategoriesState.set({ items });
        this.loadState.set({ status: "success" });
        return items;
      }),
      catchError((err: ApiException) => {
        this.loadState.set({ status: "error", error: err.message });
        throw err;
      }),
    );
  }

  private setProducts(products: Product[]): void {
    this.productsState.set({ items: products });
  }
}
