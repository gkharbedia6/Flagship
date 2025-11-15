import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from './alert.component';
import { iAlertData, iAlertRequest } from '../../../../types/alert.types';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private _snackBar = inject(MatSnackBar);

  alertRequesting(msg: string, isLoading: boolean) {
    this._snackBar.openFromComponent(AlertComponent, {
      data: <iAlertRequest>{ message: msg, type: 'request', isLoading },
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  alertSuccess(msg: string) {
    // this._snackBar.open('some message', 'X', {
    //   horizontalPosition: 'center',
    //   verticalPosition: 'top',
    //   duration: 5000,
    // });
    this._snackBar.openFromComponent(AlertComponent, {
      data: <iAlertData>{ message: msg, type: 'success' },
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
