import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthStore } from '../../../modules/auth/store/auth.store';




@Injectable({ providedIn: 'root' })
export class RootRedirectGuard implements CanActivate {

    constructor(private router: Router , private authStore: AuthStore) {}


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        const sessionState = this.authStore.authState$();

        
        if (sessionState.status === 'authenticated') {
            const session = sessionState.session;

            switch (session.user_profile.role) {
            case 'ADMIN':
                return this.router.createUrlTree(['/admin']);

            case 'CUSTOMER':
                return this.router.createUrlTree(['/customer']);

            default:
                return this.router.createUrlTree(['/auth/login']);
            }
        }

        return this.router.createUrlTree(['/auth/login']);
    }
}
