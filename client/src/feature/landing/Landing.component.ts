import { Component, inject, OnInit, WritableSignal } from '@angular/core';
import { AuthFacadeService } from '../../data/auth';
import { iUser } from '../../types';
import { RouterOutlet } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'landing',
  imports: [RouterOutlet],
  template: `
    {{ user()?.email }}
    <button (click)="signOut()" class="bg-red-500 w-20 aspect-square texr-greed-500">
      Sign Out
    </button>
    <button (click)="openSnackBar()" class="bg-blue-500 w-20 h-10">Open Alert</button>
    <router-outlet></router-outlet>
  `,
})
export class LandingComponent implements OnInit {
  private _authFacade = inject(AuthFacadeService);
  private _snackBar = inject(MatSnackBar);
  user: WritableSignal<iUser | null> = this._authFacade.getCurrentUser();

  ngOnInit(): void {
    console.log(this.user());
  }

  openSnackBar() {
    const email = this.user()?.email;
    if (!email) return;
    this._snackBar.open(email, 'X', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,
    });
  }

  signOut() {
    const currentUser = this.user();
    if (!currentUser) return;
    this._authFacade.signOut(currentUser._id).subscribe();
  }
}
