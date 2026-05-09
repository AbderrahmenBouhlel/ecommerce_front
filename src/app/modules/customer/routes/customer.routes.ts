



import { Routes } from '@angular/router';
import { CustomerDashboard } from '../pages/customer-dashboard/customer-dashboard';
import { LightcategoriesResolver } from './Lightcategories.resolver';
import { CategoryPage } from '../pages/category-page/category-page';
export const CUSTOMER_ROUTES: Routes = [
    {
        path: '', // This corresponds to /customer
        component: CustomerDashboard,
        resolve: {
            categories: LightcategoriesResolver
        },
        children: [
            {
                path: 'categories/:slug',
                component: CategoryPage,
                // resolve: {
                //     category: categoryResolver
                // }
            }
        ]
    }
];