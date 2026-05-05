import { Product, SelectableCategory } from "../models/product.model";

export interface ProductsState {
  items: Product[];
}

export interface SelectableCategoryState {
  items: SelectableCategory[];
}
