import { Routes } from '@angular/router';

import { AuthWrapper } from './modules/auth/ui/auth-wrapper/auth-wrapper';

import { LoginPage } from './modules/auth/ui/login-page/login-page';
import { CharacterOrchestratorService } from './modules/auth/services/CharacterOrchestrator/CharacterOrchestratorService';
import { RootRedirectGuard } from './core/routing/guards/RootRedirectGuard';

import { Home } from './core/shared/ui/home/home';
import { UnauthorizedPage } from './core/shared/ui/unauthorized-page/unauthorized-page';
import { RequireRoleGuardGenerator } from './core/routing/guards/RequireRoleGuardGenerator';
export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        canActivate: [RootRedirectGuard],
        component: Home // This component will never actually be shown, but it needs to be here for the guard to work
    },
    {
        path: "auth",
        component: AuthWrapper,
        providers: [CharacterOrchestratorService],
        children: [
            {
                path: "login",
                component: LoginPage
            }
        ]
    },
    

    {
        path: 'admin',
        // canActivate: [adminGuard], // Highly recommended for your project
        loadChildren: () => import('./modules/admin/routes/admin.routes').then(m => m.ADMIN_ROUTES),
        canActivate: [RequireRoleGuardGenerator(['ADMIN'])]
    },

    {
        path: 'customer',
        // canActivate: [customerGuard], // Highly recommended for your project
        loadChildren: () => import('./modules/customer/customer.routes').then(m => m.CUSTOMER_ROUTES),
        canActivate: [RequireRoleGuardGenerator(['CUSTOMER'])]
    },


    {
        path: 'unauthorized',
        pathMatch: 'full',
        component: UnauthorizedPage 
    },
];
