import { Product } from "../models/product.model";
import { SelectableCategory } from "../models/selectableCategories.model";

export interface ProductsState {
  items: Product[];
}

export interface SelectableCategoryState {
  items: SelectableCategory[];
}
