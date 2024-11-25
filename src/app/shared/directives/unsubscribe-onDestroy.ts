import { Component, Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
  selector: '[UnsubscribeOnDestroy]'
})

export class UnsubscribeOnDestroy implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
