import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from '../../authentication/services/auth.service';
import { Store } from '@ngrx/store';
import { autoLogin, logoutUser } from '../../store/actions/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store, private authService: AuthService, private router: Router) {
  }

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      this.store.dispatch(autoLogin());
      return true
    } else {
      this.store.dispatch(logoutUser());
      this.router.navigate(['/login']);
      return false
    }
  }

}
