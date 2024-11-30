import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { snackbarSelector } from '../../../store/selectors/notifications';
import { Snackbar } from '../../interfaces/snackbar';
import { clearSnackbar } from '../../../store/actions/notifications';
import { UnsubscribeOnDestroy } from '../../directives/unsubscribe-onDestroy';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent extends UnsubscribeOnDestroy implements OnInit {

  constructor(private _snackBar: MatSnackBar, private store: Store) {
    super()
  }

  ngOnInit(): void {
    this.store.select(snackbarSelector)
      .pipe(takeUntil(this.destroy$))
      .subscribe((snackbar: Snackbar): void => {
      if (snackbar.text) {
        let snackBarRef = this._snackBar.open(snackbar.text, 'close', {duration: 5000});
        snackBarRef.afterDismissed().subscribe((): void => {
          this.store.dispatch(clearSnackbar());
        })
      }
    })
  }
}
