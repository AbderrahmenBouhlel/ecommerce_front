import { CategoryCatalog } from "../models/categoryCatalog.model";



export type CategoryCatalogVM =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "success";
      data: CategoryCatalog;
    };