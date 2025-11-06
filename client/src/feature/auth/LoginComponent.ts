import { Component, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'auth-login',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    RouterLink,
  ],
  template: `
    <div
      class="min-w-[500px] top-1/2  left-1/2 absolute -translate-x-1/2 -translate-y-1/2 px-20 py-10 flex flex-col items-center justify-center"
    >
      <div class="flex gap-2 mb-10 w-full flex-col items-start justify-start">
        <p class="m-0 text-lg text-black">Welcome back</p>
        <p class="m-0 text-sm text-black opacity-70">Sign in to your account</p>
      </div>
      <mat-form-field class="w-full">
        <mat-label>Email</mat-label>
        <input matInput placeholder="Placeholder" />
      </mat-form-field>
      <a
        routerLink="/forgot-password"
        class="m-0 mb-2 text-end w-full cursor-pointer hover:opacity-80"
        >Forgot Password?</a
      >
      <mat-form-field class="w-full">
        <mat-label>Password</mat-label>
        <input matInput [type]="hide() ? 'password' : 'text'" />
        <button
          matIconButton
          matSuffix
          (click)="clickEvent($event)"
          [attr.aria-label]="'Hide password'"
          [attr.aria-pressed]="hide()"
        >
          <mat-icon>{{ hide() ? 'visibility_off' : 'visibility' }}</mat-icon>
        </button>
      </mat-form-field>
      <mat-card-actions class="mt-2 flex items-center justify-center w-full">
        <button matButton="outlined" class="button-small-rounded w-full">Sign In</button>
      </mat-card-actions>
      <div class="flex flex-row items-center mt-10 justify-center gap-1">
        <p>Don't have an account?</p>
        <a routerLink="/auth/sign-up" class="cursor-pointer underline hover:opacity-80"
          >Sign Up Now</a
        >
      </div>
    </div>
  `,
})
export class LoginComponent {
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
