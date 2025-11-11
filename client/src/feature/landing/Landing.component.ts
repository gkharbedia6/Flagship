import { Component, inject, WritableSignal } from '@angular/core';
import { AuthFacadeService } from '../../data/auth';
import { iUser } from '../../types';

@Component({
  selector: 'landing',
  imports: [],
  template: ` {{ user()?.email }}
    <button (click)="signOut()" class="bg-red-500 w-20 aspect-square texr-greed-500">
      Sign Out
    </button>`,
})
export class LandingComponent {
  private _authFacade = inject(AuthFacadeService);
  user: WritableSignal<iUser | null> = this._authFacade.getCurrentUser();
  signOut() {
    const currentUser = this.user();
    if (!currentUser) return;
    this._authFacade.signOut(currentUser._id).subscribe();
  }
}
