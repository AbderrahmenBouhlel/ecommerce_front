



import { Routes } from '@angular/router';
import { CustomerDashboard } from './pages/customer-dashboard/customer-dashboard';

export const CUSTOMER_ROUTES: Routes = [
    {
        path: '', // This corresponds to /customer
        component: CustomerDashboard,
        // You can add children here too
    }
];