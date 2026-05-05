import { effect, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthState } from "../../store/state/auth.state";
import { AuthStore } from "../../store/auth.store";






@Injectable({ providedIn: 'root' })
export class AuthNavigationService {

  constructor(
    private router: Router
  ) {}

  public handleNavigation(state: AuthState) {
    console.log(state)
    if (state.status !== 'authenticated') {
      this.router.navigate(['/auth/login']);
      return;
    }

    const role = state.session.user_profile.role;

    const route = role === 'ADMIN'
      ? '/admin'
      : '/customer';

    this.router.navigate([route]);
  }
}