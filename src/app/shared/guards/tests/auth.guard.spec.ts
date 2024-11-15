import {TestBed} from "@angular/core/testing";
import {AuthGuard} from "../auth.guard";
import {AuthService} from "../../../authentication/services/auth.service";
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: AuthService;
  let store: MockStore<any>;
  let router: Router;

  const routerStub = {
    url: '',
    navigate: (route: string) => route
  }

  // @ts-ignore
  const route: ActivatedRouteSnapshot = null;
  // @ts-ignore
  const state: RouterStateSnapshot = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService,
          useValue: {
            autoLogin: () => {},
            isAuthenticated: () => {},
            logout: () => {},
          }
        },
        provideMockStore(),
        { provide: Router, useValue: routerStub },
      ]
    });

    store = TestBed.inject(MockStore);
    authGuard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('create an instance', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should return true and autologin user', () => {
    const method = spyOn(authService, 'autoLogin');
    spyOn(authService, 'isAuthenticated').and.callFake(() => true);
    const result = authGuard.canActivate(route, state);
    expect(method).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should return false logout user and send user to login page', () => {
    const method = spyOn(authService, 'logout');
    const routerSpy = spyOn(router, 'navigate');
    spyOn(authService, 'isAuthenticated').and.callFake(() => false);
    const result = authGuard.canActivate(route, state);
    expect(method).toHaveBeenCalled();
    // @ts-ignore
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(false);
  });
});
