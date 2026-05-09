import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { FiltersStore } from '../../../stores/FilterManagementStore/filters.store';
import { catchError, map, Observable, throwError } from 'rxjs';

export const filtersResolver: ResolveFn<boolean> = (route, state): Observable<boolean> => {
  const filtersStore = inject(FiltersStore);
  // const router = inject(Router);

  return filtersStore.loadFilters().pipe(
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