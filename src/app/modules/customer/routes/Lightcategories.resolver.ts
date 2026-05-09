
import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { CATEGORIES_PORT } from '../../admin/stores/CategoryManagementStore/categories.store';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CategoryDTO, GetCategoriesSuccessResponseDTO } from '../../admin/stores/CategoryManagementStore/apis/models/getCategories.api';
import { GetLightCategoriesSuccessResponseDTO, LightCategoryDTO } from '../../admin/stores/CategoryManagementStore/apis/models/getCategoriesLight.api';



export const LightcategoriesResolver: ResolveFn<LightCategoryDTO[]> = (route, state): Observable<LightCategoryDTO[]> => {
  const categoriesAdapter = inject(CATEGORIES_PORT);
  // const router = inject(Router);

  return categoriesAdapter.getLightCategories().pipe(
    map((response: GetLightCategoriesSuccessResponseDTO) => {
        const categoriesDTO :LightCategoryDTO[]= response.data;
        return categoriesDTO;
    }),
    catchError((error) => {
      console.error('Resolver failed:', error);
      return throwError(() => error);
    })
  );
};