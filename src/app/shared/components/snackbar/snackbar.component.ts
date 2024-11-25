import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { snackbarSelector } from '../../../store/selectors/notifications';
import { Snackbar } from '../../interfaces/snackbar';
import { clearSnackbar } from '../../../store/actions/notifications';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent implements OnInit, OnDestroy {
  snackbarSub!: Subscription;

  constructor(private _snackBar: MatSnackBar, private store: Store) {}

  ngOnInit(): void {
    this.snackbarSub = this.store.select(snackbarSelector).subscribe((snackbar: Snackbar): void => {
      if (snackbar.text) {
        let snackBarRef = this._snackBar.open(snackbar.text, 'close', {duration: 5000});
        snackBarRef.afterDismissed().subscribe((): void => {
          this.store.dispatch(clearSnackbar());
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.snackbarSub.unsubscribe();
  }
}
