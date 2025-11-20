import { Component, inject, OnInit, WritableSignal } from '@angular/core';
import { AuthFacadeService } from '../../data/auth';
import { iUser } from '../../types';
import { RouterOutlet } from '@angular/router';
import { AlertService } from '../shared/feature/alert/alert.service';

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
  alert = inject(AlertService);
  user: WritableSignal<iUser | null> = this._authFacade.getCurrentUser();

  ngOnInit(): void {
    // console.log(this.user());
  }

  openSnackBar() {
    this.alert.alert('Sign in successfully', 'success');
  }

  signOut() {
    const currentUser = this.user();
    if (!currentUser) return;
    this._authFacade.signOut(currentUser._id).subscribe();
  }
}
