import { Component, inject, input, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { iUser } from '../../../../types';
import { AuthFacadeService } from '../../../../data/auth';

@Component({
  selector: 'shell-header',
  imports: [MatButtonModule, MatMenuModule],
  template: `
    <header class="w-full flex flex-row justify-between items-center p-12">
      <div>
        <button matButton (click)="router.navigateByUrl('/')">Home</button>
        <!-- <mat-menu #menu="matMenu">
        <button mat-menu-item>Item 1</button>
        <button mat-menu-item>Item 2</button>
      </mat-menu> -->
        <button matButton [matMenuTriggerFor]="lenu">Lenu</button>
        <mat-menu #lenu="matMenu">
          <button mat-menu-item>not 1</button>
          <button mat-menu-item>Item 2</button>
        </mat-menu>
        <button matButton [matMenuTriggerFor]="lolo">Lolo</button>
        <mat-menu #lolo="matMenu">
          <button mat-menu-item>lolo 1</button>
          <button mat-menu-item>ll 2</button>
        </mat-menu>
      </div>
      <div>
        <button
          matIconButton
          [matMenuTriggerFor]="profile"
          class="rounded-full w-8 aspect-square bg-black"
        ></button>
        <mat-menu #profile="matMenu">
          <button mat-menu-item (click)="router.navigateByUrl('/profile')">Profile</button>
          <button mat-menu-item (click)="signOut()">Sign Out</button>
        </mat-menu>
      </div>
    </header>
  `,
})
export class ShellHeaderComponent {
  router = inject(Router);
  private _authFacade = inject(AuthFacadeService);
  user: WritableSignal<iUser | null> = this._authFacade.getCurrentUser();

  signOut() {
    const currentUser = this.user();
    if (!currentUser) return;
    this._authFacade.signOut(currentUser._id);
  }
}
