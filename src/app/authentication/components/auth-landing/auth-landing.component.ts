import {Component, OnInit} from '@angular/core';
import { RouterOutlet, Router } from "@angular/router";
import { Observable } from "rxjs";
import { authLoadingSelector } from "../../../store/selectors/auth";
import {select, Store} from "@ngrx/store";
import { AsyncPipe, NgIf } from '@angular/common';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-landing',
  standalone: true,
  imports: [
    RouterOutlet,
    NgIf,
    LoaderComponent,
    AsyncPipe
  ],
  templateUrl: './auth-landing.component.html',
  styleUrl: './auth-landing.component.scss'
})
export class AuthLandingComponent implements OnInit {
  isLoading$: Observable<boolean> = this.store.pipe(select(authLoadingSelector));

  constructor(private store: Store, private router: Router, private service: AuthService) {}

  ngOnInit(): void {
    if (this.service.isAuthenticated()) {
      this.router.navigate(['/portal']);
    }
  }

}
