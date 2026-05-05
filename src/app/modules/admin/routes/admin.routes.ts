import { Routes } from '@angular/router';
import { AdminDashboardPage } from '../features/dashboard/admin-dashboard-page/admin-dashboard-page';
import { FilterManagementPage } from '../features/filter-managment/filter-management-page/filter-management-page';
import { filtersResolver } from './filters-resolver';
import { categoriesResolver } from './categories-resolver';
import { CategoryManagementPage } from '../features/category-management/category-management-page/category-management-page';


import { FiltersStore } from '../stores/FilterManagementStore/filters.store';
import { CategoriesStore } from '../stores/CategoryManagementStore/categories.store';
import { ProductManagementPage } from '../features/product-managment/product-management-page/product-management-page';
import { ProductCreationPage } from '../features/product-managment/product-creation-page/product-creation-page';
import { Step1BasicInfoComponent } from '../features/product-managment/components/step1-basic-info-component/step1-basic-info-component';

export const ADMIN_ROUTES: Routes = [
    {
        path: '', // This corresponds to /admin
        component: AdminDashboardPage,
        children: [
            {
                path: 'taxonomy/filters',
                component: FilterManagementPage,
                resolve: {
                    filtersLoaded: filtersResolver
                },
                providers: [FiltersStore] // Provide the store here if it's only used in this route and its children
            },

            {
                path: 'taxonomy/categories',
                component: CategoryManagementPage,
                resolve: {
                    categoriesLoaded: categoriesResolver
                },
                providers: [CategoriesStore] // Provide the store here if it's only used in this route and its children
            },



            {
                path: 'products',
                component : ProductManagementPage,
            },
            {
                path: 'products/new',
                component: ProductCreationPage,
                children: [
                    {path: '', redirectTo: 'step-1', pathMatch: 'full'},
                    {path: 'step-1', component: Step1BasicInfoComponent}
                ]
            }


        ]
    }
];