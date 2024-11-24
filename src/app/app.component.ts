import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoPageComponent } from './portal/views/todo-page/todo-page.component';
import { Store } from '@ngrx/store';
import { selectIsLightMode } from './store/selectors/theme';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { OverlayContainer } from '@angular/cdk/overlay';
import { setTheme } from './store/actions/theme';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TodoPageComponent,
    CommonModule,
    AsyncPipe,
    MatButton
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  isLightMode$ = this.store.select(selectIsLightMode);

  constructor(
    private store: Store,
    private overlayContainer: OverlayContainer,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.checkThemeMode();
  }

  checkThemeMode() {
    const isLightMode = localStorage.getItem('isLightMode') === 'true';
    this.store.dispatch(setTheme({ isLightMode }));
    const overlayContainerElement = this.overlayContainer.getContainerElement();
    this.isLightMode$.subscribe((isLightMode: boolean) => {
      if (isLightMode) {
        localStorage.setItem('isLightMode', 'true');
        this.renderer.removeClass(overlayContainerElement, 'dark-theme-overlay');
      } else {
        localStorage.setItem('isLightMode', 'false');
        this.renderer.addClass(overlayContainerElement, 'dark-theme-overlay');
      }
    });
  }
}
