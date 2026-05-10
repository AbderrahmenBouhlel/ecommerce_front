import { Observable } from "rxjs";
import { GetCategoryCatalogSuccessResponseDTO } from "./models/getCategoryCatalog.api";

export interface CategoryCatalogPort {
  getCategoryCatalog(categorySlug: string): Observable<GetCategoryCatalogSuccessResponseDTO>;
}