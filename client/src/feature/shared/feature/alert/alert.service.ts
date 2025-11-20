import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from './alert.component';
import { iAlertData } from '../../../../types/alert.types';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private _snackBar = inject(MatSnackBar);

  alertRequesting(msg: string) {
    this._snackBar.openFromComponent(AlertComponent, {
      data: <iAlertData>{ message: msg, type: 'request', isLoading: true },
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  alert(msg: string, type: iAlertData['type']) {
    this._snackBar.openFromComponent(AlertComponent, {
      data: <iAlertData>{ message: msg, type: type, isLoading: false },
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass:
        type === 'success'
          ? 'alert-success'
          : type === 'error'
          ? 'alert-error'
          : type === 'warning'
          ? 'alert-warning'
          : '',
    });
  }
}
