import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '', canActivate: [AuthGuard], loadComponent: () => import('./portal/components/portal-landing/portal-landing.component')
      .then((m) => m.PortalLandingComponent) , children: [
      {path: '', redirectTo: 'portal', pathMatch: 'full'},
      {path: 'portal', loadComponent: () => import('./portal/views/todo-page/todo-page.component')
          .then((m) => m.TodoPageComponent)},
    ],
  },
  {
    path: '', loadComponent: () => import('./authentication/components/auth-landing/auth-landing.component')
      .then((m) => m.AuthLandingComponent) , children: [
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: 'login', loadComponent: () => import('./authentication/views/login/login.component')
          .then((m) => m.LoginComponent)},
      {path: 'register', loadComponent: () => import('./authentication/views/sign-up/sign-up.component')
          .then((m) => m.SignUpComponent)},
      {path: 'forgot-password', loadComponent: () => import('./authentication/views/forgot-password/forgot-password.component')
          .then((m) => m.ForgotPasswordComponent)},
    ],
  },
  {path: '**', redirectTo: '/portal'},
];
