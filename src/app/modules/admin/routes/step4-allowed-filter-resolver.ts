
import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AllowedFilter } from '../stores/CategoryManagementStore/models/Category.model';
import { CategoryFilterWithMetadataDTO } from '../stores/CategoryManagementStore/apis/models/getCategoryFilters.api';
import {CATEGORIES_PORT} from '../stores/CategoryManagementStore/categories.store';
import { ProductCreationService } from '../features/product-managment/services/ProductCreationService';

export const Step4AllowedFiltersResolver: ResolveFn<CategoryFilterWithMetadataDTO[]> = (route, state): Observable<CategoryFilterWithMetadataDTO[]> => {
  
  const categoryPort = inject(CATEGORIES_PORT);
  const productCreationService = inject(ProductCreationService);

  const categoryId = productCreationService.getBasicInfo()?.categoryId;

  if (!categoryId) {
    const errorMessage = 'Category ID is missing. Cannot load allowed filters.';
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  return categoryPort.getCategoryFiltersWithMetadata(categoryId).pipe(
    map((response) => {
      // success → allow navigation
      const filtersWithMetadata: CategoryFilterWithMetadataDTO[] = response.data;
      return filtersWithMetadata;
    }),
    catchError((error) => {
      console.error('Resolver failed:', error);
      return throwError(() => error);
    })
  );
};
