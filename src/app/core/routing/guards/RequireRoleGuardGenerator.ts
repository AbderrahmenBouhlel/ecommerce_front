import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthStore } from '../../../modules/auth/store/auth.store';
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';




export const RequireRoleGuardGenerator = (requiredRole: string[]): CanActivateFn => {

    const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        const authStore = inject(AuthStore);
        const router = inject(Router);

        const authState = authStore.authState$();
        if (authState.status === 'authenticated') {
            const userRole = authState.session.user_profile.role;
            if (requiredRole.includes(userRole)) {
                return true;
            } else {
                // Redirect to unauthorized page or some other page
                return router.parseUrl('/unauthorized');
            }
        }
        // Redirect to login if not authenticated
        return router.parseUrl('/auth/login');
    };
    return authGuard;
}