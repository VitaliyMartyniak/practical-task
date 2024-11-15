import {Component, OnDestroy, OnInit} from '@angular/core';
import {catchError, finalize, of, Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {authLoadingSelector, userSelector} from "../../../store/selectors/auth";
import {setAuthLoading} from "../../../store/actions/auth";
import {AuthService} from "../../../authentication/services/auth.service";
import { Router, RouterOutlet } from "@angular/router";
// import {setSnackbar} from "../../../store/actions/notifications";
// import {setArticles, setArticlesLoading} from "../../../store/actions/articles";
// import {PortalService} from "../../services/portal.service";
import { TodoFormComponent } from '../../views/todo-page/components/todo-form/todo-form.component';
import { TodoListComponent } from '../../views/todo-page/components/todo-list/todo-list.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { UserData } from '../../../shared/interfaces/auth';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-portal-landing',
  standalone: true,
  imports: [
    TodoFormComponent,
    TodoListComponent,
    AsyncPipe,
    MatButton,
    RouterOutlet,
    NgIf
  ],
  templateUrl: './portal-landing.component.html',
  styleUrl: './portal-landing.component.scss'
})
export class PortalLandingComponent implements OnInit, OnDestroy {
  private userSub!: Subscription;
  private isLoadingSub!: Subscription;
  user!: UserData;
  isLoading = true;

  constructor(private authService: AuthService, private router: Router, private store: Store) { }
  // private portalService: PortalService,
  ngOnInit(): void {
    // this.getArticles();
    this.store.dispatch(setAuthLoading({isLoading: true}));
    this.userSub = this.store.select(userSelector).subscribe((user: UserData | null): void => {
      if (user) {
        this.user = user;
        this.store.dispatch(setAuthLoading({isLoading: false}));
      }
    })
    this.isLoadingSub = this.store.select(authLoadingSelector).subscribe((isLoading: boolean): void => {
      this.isLoading = isLoading;
    })
  }

  // getArticles(): void {
  //   this.store.dispatch(setArticlesLoading({isLoading: true}));
  //   this.portalService.getArticles().pipe(
  //     finalize((): void => {
  //       this.store.dispatch(setArticlesLoading({isLoading: false}));
  //     }),
  //     catchError((e) => {
  //       this.store.dispatch(setSnackbar({text: e, snackbarType: 'error'}));
  //       return of([]);
  //     }),
  //   ).subscribe((articles: any) => {
  //     this.store.dispatch(setArticles({articles}));
  //   })
  // }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout().pipe(
      catchError((e) => {
        // this.store.dispatch(setSnackbar({text: e, snackbarType: 'error'}));
        return of([]);
      }),
    ).subscribe(() => {
      this.router.navigate(['login']);
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.isLoadingSub.unsubscribe();
  }
}