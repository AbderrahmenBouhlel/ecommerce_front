import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { CategoriesStore } from '../stores/CategoryManagementStore/categories.store';
import { catchError, map, Observable, throwError } from 'rxjs';

export const categoriesResolver: ResolveFn<boolean> = (route, state): Observable<boolean> => {
  const categoriesStore = inject(CategoriesStore);
  // const router = inject(Router);

  return categoriesStore.loadCategories().pipe(
    map((response) => {
      // success → allow navigation
      return true;
    }),
    catchError((error) => {
      console.error('Resolver failed:', error);
      return throwError(() => error);
      // OPTION B → redirect
      // router.navigate(['/error']);
      // return of(false);
    })
  );
};