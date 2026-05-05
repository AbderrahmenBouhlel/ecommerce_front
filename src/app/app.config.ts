import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { AUTH_PORT } from './modules/auth/store/auth.store';
import { authAdapter } from './modules/auth/store/apis/auth.adapter';


import { provideAppInitializer, inject } from '@angular/core';
import { AuthInitializerService } from './modules/auth/services/AuthInitializerService/AuthInitializerService';
import { AuthInterceptor } from './core/routing/interceptors/AuthInterceptor';
import { withInterceptorsFromDi } from '@angular/common/http';

import { FILTERS_PORT } from './modules/admin/stores/FilterManagementStore/filters.store';
import { FiltersAdapter } from './modules/admin/stores/FilterManagementStore/apis/filters.adapter';


import { CATEGORIES_PORT } from './modules/admin/stores/CategoryManagementStore/categories.store';
import { CategoriesAdapter } from './modules/admin/stores/CategoryManagementStore/apis/Categories.adapter';


import {PRODUCTS_PORT} from './modules/admin/stores/ProductManagmentStore/products.store';
import { ProductsAdapter } from './modules/admin/stores/ProductManagmentStore/apis/ProductsAdapter.adapter';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptorsFromDi() 
    ),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {provide:AUTH_PORT , useClass:authAdapter},

    {provide: FILTERS_PORT, useClass: FiltersAdapter}, 

    {provide: CATEGORIES_PORT, useClass: CategoriesAdapter},

    {provide: PRODUCTS_PORT, useClass: ProductsAdapter},




    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}, // Registering the interceptor as a provider
    
    provideAppInitializer((): Promise<void> => {
      const authInitializer = inject(AuthInitializerService);
      return authInitializer.init();
    })
  ]
};
