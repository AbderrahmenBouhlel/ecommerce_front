import { Inject, Injectable, InjectionToken, signal } from "@angular/core";
import { Observable, catchError, map } from "rxjs";
import { ApiException } from "../../../../core/shared/api/api.responseTypes";
import { CategoryCatalogPort } from "./apis/CategoryCatalogPort.port";
import { GetCategoryCatalogSuccessResponseDTO } from "./apis/models/getCategoryCatalog.api";
import { CategoryCatalog, mapGetCategoryCatalogDataDTOToCategoryCatalog } from "./models/categoryCatalog.model";
import { CategoryCatalogVM } from "./state/categoryCatalog.state";

export const CATEGORY_CATALOG_PORT = new InjectionToken<CategoryCatalogPort>("CATEGORY_CATALOG_PORT");




@Injectable()
export class CategoryCatalogStore {
    private readonly vm = signal<CategoryCatalogVM>({
        status: "idle",
    });

  readonly vm$ = this.vm.asReadonly();

  constructor(@Inject(CATEGORY_CATALOG_PORT) private readonly categoryCatalogPort: CategoryCatalogPort) {}

  loadCategoryCatalog(categorySlug: string): Observable<CategoryCatalog> {
    this.vm.set({ status: "loading" });

    return this.categoryCatalogPort.getCategoryCatalog(categorySlug).pipe(
      map((response: GetCategoryCatalogSuccessResponseDTO) => {
        const catalog = mapGetCategoryCatalogDataDTOToCategoryCatalog(response.data);

        this.vm.set({
          status: "success",
          data: catalog,
        });

        return catalog;
      }),
      catchError((err: ApiException) => {
        this.vm.set({ status: "error", message: err.message });
        throw err;
      }),
    );
  }
}