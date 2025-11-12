import { Component, inject, OnInit, WritableSignal } from '@angular/core';
import { AuthFacadeService } from '../../data/auth';
import { iUser } from '../../types';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'landing',
  imports: [RouterOutlet],
  template: `
    {{ user()?.email }}
    <button (click)="signOut()" class="bg-red-500 w-20 aspect-square texr-greed-500">
      Sign Out
    </button>
    <router-outlet></router-outlet>
  `,
})
export class LandingComponent implements OnInit {
  private _authFacade = inject(AuthFacadeService);
  user: WritableSignal<iUser | null> = this._authFacade.getCurrentUser();

  ngOnInit(): void {
    console.log(this.user());
  }

  signOut() {
    const currentUser = this.user();
    if (!currentUser) return;
    this._authFacade.signOut(currentUser._id).subscribe();
  }
}
