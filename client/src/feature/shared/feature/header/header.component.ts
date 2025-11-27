import {
  Component,
  DOCUMENT,
  effect,
  inject,
  OnInit,
  Renderer2,
  WritableSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { iUser } from '../../../../types';
import { AuthFacadeService } from '../../../../data/auth';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../../../data/theme/theme.service';

@Component({
  selector: 'shell-header',
  imports: [MatButtonModule, MatMenuModule, MatIconModule],
  template: `
    <header class="w-full flex flex-row px-4 justify-between items-center">
      <div class="flex flex-row  items-center">
        <p (click)="router.navigateByUrl('/')" class="cursor-pointer font-bold italic text-sm mr-4">
          flagship
        </p>
        <p>/</p>
      </div>
      <div>
        <button
          matIconButton
          [matMenuTriggerFor]="profile"
          class="rounded-full w-8 aspect-square bg-black"
        >
          <img [src]="this.user()?.imageUrl" [alt]="this.user()?.email + 'Profile image'" />
        </button>
        <mat-menu #profile="matMenu" class="no-padding-menu w-[200px]">
          <div class="flex flex-col mx-1 px-2  py-2 gap-0 items-start justify-center text-[12px]">
            <p class="p-0 m-0">{{ this.user()?.fullName ?? 'No name provided yet' }}</p>
            <p class="p-0 m-0 opacity-70 ">{{ this.user()?.email }}</p>
          </div>
          <div class="h-[1px] w-full bg-neutral-300"></div>

          <button mat-menu-item class="menu-item" (click)="router.navigateByUrl('/profile')">
            <mat-icon class="text-[17px] mt-[4px] mr-1!">settings</mat-icon>
            <span>Profile settings</span>
          </button>
          <div class="h-[1px] w-full bg-neutral-300"></div>

          <div class="flex flex-col">
            <p class="my-0 mx-1 px-2 py-2 opacity-70">Theme</p>
            <div class="flex flex-col items-start justify-start">
              <button
                (click)="themeService.setPreferredTheme('dark')"
                class="menu-item mt-1 relative flex flex-row items-center "
                mat-menu-item
              >
                @if (themeService.theme() === 'dark') {
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-circle h-2 w-2 fill-current"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                }
                <span class="ml-2 absolute top-1/2 -translate-y-1/2 left-1/8">Dark</span>
              </button>

              <button
                (click)="themeService.setPreferredTheme('light')"
                class="menu-item mt-1"
                mat-menu-item
              >
                @if (themeService.theme() === 'light') {
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-circle h-2 w-2 fill-current"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                }

                <span class="ml-2 absolute top-1/2 -translate-y-1/2 left-1/8">Light</span>
              </button>
              <button
                (click)="themeService.clearPreferredTheme()"
                class="menu-item mt-1"
                mat-menu-item
              >
                @if (themeService.theme() === 'system') {

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-circle h-2 w-2 fill-current"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                }
                <span class="ml-2 absolute top-1/2 -translate-y-1/2 left-1/8">System</span>
              </button>
            </div>
          </div>
          <div class="h-[1px] w-full bg-neutral-300"></div>

          <p class="menu-item mt-1" mat-menu-item (click)="signOut()">Sign Out</p>
        </mat-menu>
      </div>
    </header>
  `,
})
export class ShellHeaderComponent implements OnInit {
  router = inject(Router);
  themeService = inject(ThemeService);
  private _authFacade = inject(AuthFacadeService);
  user: WritableSignal<iUser | null> = this._authFacade.getCurrentUser();

  ngOnInit(): void {}

  signOut() {
    const currentUser = this.user();
    if (!currentUser) return;
    this._authFacade.signOut(currentUser._id);
  }
}
