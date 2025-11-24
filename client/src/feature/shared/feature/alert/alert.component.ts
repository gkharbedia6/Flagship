import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { iAlertData } from '../../../../types/alert.types';

@Component({
  selector: 'alert',
  imports: [MatIconModule],
  template: `<div class="flex flex-row justify-between">
    <div class="flex flex-row justify-start gap-3 items-center">
      @switch (data.type) { @case ('success') {
      <mat-icon fontSet="material-symbols-outlined">check</mat-icon>
      } @case ('error') {
      <mat-icon fontSet="material-symbols-outlined">error</mat-icon>
      } @case ('warning') {
      <mat-icon fontSet="material-symbols-outlined">warning</mat-icon>
      } }
      {{ data.message }}
    </div>

    @if(data.isLoading) {
    <mat-icon fontSet="material-symbols-outlined" class=" animate-spin">progress_activity</mat-icon>
    } @else {
    <mat-icon
      class="cursor-pointer hover:opacity-80"
      matSnackBarAction
      (click)="snackBarRef.dismissWithAction()"
      fontSet="material-symbols-outlined"
      >close</mat-icon
    >
    }
  </div>`,
})
export class AlertComponent {
  snackBarRef = inject(MatSnackBarRef);
  data = inject<iAlertData>(MAT_SNACK_BAR_DATA);
}
