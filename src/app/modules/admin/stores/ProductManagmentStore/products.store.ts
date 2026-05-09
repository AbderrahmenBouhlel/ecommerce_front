import { inject, Inject, Injectable, InjectionToken, signal } from "@angular/core";
import { ApiException } from "../../../../core/shared/api/api.responseTypes";
import { LoadState } from "../../../../core/shared/state/load-state";
import { Observable, catchError, map } from "rxjs";
import { ProductsPort } from "./apis/ProductsPort.port";
import { CreateProductSuccessResponseDTO ,CreateProductRequestDTO} from "./apis/models/createProduct.api";
import { CreateProductVariantSuccessResponseDTO , CreateProductVariantRequestDTO } from "./apis/models/createProductVariant.api";

import { GetLightCategoriesSuccessResponseDTO } from "../CategoryManagementStore/apis/models/getCategoriesLight.api";
import { CreateProductVariantSkusRequestDTO, CreateProductVariantSkusSuccessResponseDTO } from "./apis/models/createProductVariantSkus.api";
import { CreateProductFilterValuesRequestDTO, CreateProductFilterValuesSuccessResponseDTO } from "./apis/models/createProductFilterValues.api";
import {
  mapCreateProductDTOToProduct,
  mapCreateProductVariantDTOToProductVariant,
  mapProductFilterValueDTOToProductFilterValue,
  Product,
  ProductVariant,
  ProductFilterValue,
} from "./models/product.model";

import { VariantSku } from "./models/product.model";


import { SelectableCategory , mapSelectableCategoryDTOToSelectableCategory } from "./models/selectableCategories.model";
import { ProductsState, SelectableCategoryState } from "./state/products.state";
import { CATEGORIES_PORT } from "../CategoryManagementStore/categories.store";
import { CategoriesPort } from "../CategoryManagementStore/apis/CategoriesPort.port";

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

  constructor(
    @Inject(PRODUCTS_PORT) private readonly productsPort: ProductsPort,
    @Inject(CATEGORIES_PORT) private readonly categoriesPort: CategoriesPort,
  ) {}

  createProduct(name: string, categoryId: number, price: number, description?: string): Observable<Product> {
    const productDto: CreateProductRequestDTO = {
      name,
      description: description || "",
      price,
      categoryId,
    };

    return this.productsPort.createProduct(productDto).pipe(
      map((response: CreateProductSuccessResponseDTO) => {
        const createdProduct: Product = mapCreateProductDTOToProduct(response.data);

        this.setProducts([...this.productsState().items, createdProduct]);

        return createdProduct;
      }),
      catchError((err: ApiException) => {
        this.loadState.set({ status: "error", error: err.message });
        throw err;
      }),
    );
  }

  createProductVariant(productId: number, colorName: string, colorCode: string, images: File[]): Observable<ProductVariant> {
    const variantDto: CreateProductVariantRequestDTO = {
      color_name: colorName,
      color_code: colorCode,
      images,
    };

    return this.productsPort.createProductVariant(productId, variantDto).pipe(
      map((response: CreateProductVariantSuccessResponseDTO) => {
        const createdVariant: ProductVariant = mapCreateProductVariantDTOToProductVariant(response.data);

        // Add variant to the product in state
        const updatedProducts = this.productsState().items.map((product: Product) => {
          if (product.id !== productId) {
            return product;
          }

          return {
            ...product,
            variants: [...product.variants, createdVariant],
          };
        });

        this.setProducts(updatedProducts);

        return createdVariant;
      }),
      catchError((err: ApiException) => {
        this.loadState.set({ status: "error", error: err.message });
        throw err;
      }),
    );
  }

  createProductVariantSkus(variantId: number, skus: { size: string; stock: number }[]): Observable<VariantSku[]> {
    const body: CreateProductVariantSkusRequestDTO = { skus };

    return this.productsPort.createProductVariantSkus(variantId, body).pipe(
      map((response: CreateProductVariantSkusSuccessResponseDTO) => {
        // Map DTO to local VariantSku model (keep reserved/sku_code if needed elsewhere)
        const created: VariantSku[] = response.data.map(d => ({ id: d.id, size: d.size, stock: d.stock }));

        // update local product state to include these skus on the variant
        const updatedProducts = this.productsState().items.map((product: Product) => ({
          ...product,
          variants: product.variants.map(v => v.id === variantId ? { ...v, skus: [...v.skus, ...created] } : v)
        }));
        this.setProducts(updatedProducts);

        return created;
      }),
      catchError((err: ApiException) => {
        this.loadState.set({ status: "error", error: err.message });
        throw err;
      }),
    );
  }

  createProductFilterValues(productId: number, filterValueIds: number[]): Observable<ProductFilterValue[]> {
    const body: CreateProductFilterValuesRequestDTO = {
      filter_values: filterValueIds.map((filterValueId: number) => ({ filter_value_id: filterValueId })),
    };

    return this.productsPort.createProductFilterValues(productId, body).pipe(
      map((response: CreateProductFilterValuesSuccessResponseDTO) => {
        const createdFilterValues: ProductFilterValue[] = response.data.map((item) =>
          mapProductFilterValueDTOToProductFilterValue(item),
        );

        const updatedProducts = this.productsState().items.map((product: Product) => {
          if (product.id !== productId) {
            return product;
          }

          return {
            ...product,
            filterValues: [...product.filterValues, ...createdFilterValues],
          };
        });

        this.setProducts(updatedProducts);

        return createdFilterValues;
      }),
      catchError((err: ApiException) => {
        this.loadState.set({ status: "error", error: err.message });
        throw err;
      }),
    );
  }


  loadSelectableCategories(): Observable<SelectableCategory[]> {
    this.loadState.set({ status: "loading" });

    return this.categoriesPort.getLightCategories().pipe(
      map((response: GetLightCategoriesSuccessResponseDTO) => {
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
