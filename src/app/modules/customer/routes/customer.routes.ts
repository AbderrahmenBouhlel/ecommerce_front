



import { Routes } from '@angular/router';
import { CustomerDashboard } from '../pages/customer-dashboard-feature/customer-dashboard/customer-dashboard';
import { LightcategoriesResolver } from './Lightcategories.resolver';
import { CategoryPage } from '../pages/category-page-feature/category-page/category-page';
import { CategoryCatalogStore } from '../stores/CategoryCatalogManagment/categoryCatalog.store';
export const CUSTOMER_ROUTES: Routes = [
    {
        path: '', // This corresponds to /customer
        component: CustomerDashboard,
        resolve: {
            categories: LightcategoriesResolver
        },
        children: [
            {
                path: 'category/:slug',
                component: CategoryPage,
                providers: [CategoryCatalogStore]
            }
        ]
    }
];