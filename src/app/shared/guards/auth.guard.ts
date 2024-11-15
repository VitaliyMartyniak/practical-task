import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "../../authentication/services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot
  ): Observable<boolean> |  Promise<boolean> | boolean {
    if (this.authService.isAuthenticated()) {
      this.authService.autoLogin();
      console.log('true');
      return true
    } else {
      this.authService.logout();
      this.router.navigate(['/login']);
      console.log('false');
      return false
    }
  }

}
