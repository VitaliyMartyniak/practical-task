import {Component, OnInit} from '@angular/core';
import { takeUntil } from "rxjs";
import {Store} from "@ngrx/store";
import {authLoadingSelector, userSelector} from "../../../store/selectors/auth";
import { logoutUser, logoutUserSuccess, setAuthLoading } from "../../../store/actions/auth";
import {AuthService} from "../../../authentication/services/auth.service";
import { Router, RouterOutlet } from "@angular/router";
import { TodoFormComponent } from '../../views/todo-page/components/todo-form/todo-form.component';
import { TodoListComponent } from '../../views/todo-page/components/todo-list/todo-list.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { UserData } from '../../../shared/interfaces/auth';
import { MatButton } from '@angular/material/button';
import { toggleTheme } from '../../../store/actions/theme';
import { selectIsLightMode } from '../../../store/selectors/theme';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Actions, ofType } from '@ngrx/effects';
import { UnsubscribeOnDestroy } from '../../../shared/directives/unsubscribe-onDestroy';

@Component({
  selector: 'app-portal-landing',
  standalone: true,
  imports: [
    TodoFormComponent,
    TodoListComponent,
    AsyncPipe,
    MatButton,
    RouterOutlet,
    NgIf,
    MatSlideToggle
  ],
  templateUrl: './portal-landing.component.html',
  styleUrl: './portal-landing.component.scss'
})
export class PortalLandingComponent extends UnsubscribeOnDestroy implements OnInit {
  isLightMode$ = this.store.select(selectIsLightMode);
  user!: UserData;
  isLoading = true;

  constructor(private authService: AuthService, private router: Router, private store: Store, private actions$: Actions) {
    super()
  }
  ngOnInit(): void {
    this.store.dispatch(setAuthLoading({isLoading: true}));
    this.store.select(userSelector).pipe(
      takeUntil(this.destroy$))
      .subscribe((user: UserData | null): void => {
      if (user) {
        this.user = user;
        this.store.dispatch(setAuthLoading({isLoading: false}));
      }
    })
    this.store.select(authLoadingSelector).pipe(
      takeUntil(this.destroy$)).subscribe((isLoading: boolean): void => {
      this.isLoading = isLoading;
    })
    this.subscribeToLogoutSuccess();
  }

  onToggleTheme() {
    this.store.dispatch(toggleTheme());
  }

  logout(event: Event): void {
    event.preventDefault();
    this.store.dispatch(logoutUser());
  }

  subscribeToLogoutSuccess(): void {
    this.actions$.pipe(
      ofType(logoutUserSuccess),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.router.navigate(['login']);
    });
  }
}
