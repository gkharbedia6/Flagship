import { Component, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'auth-register',
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
        <p class="m-0 text-lg text-black">Get started</p>
        <p class="m-0 text-sm text-black opacity-70">Create a new account</p>
      </div>
      <mat-form-field class="w-full">
        <mat-label>Username</mat-label>
        <input matInput />
      </mat-form-field>
      <mat-form-field class="w-full">
        <mat-label>Email</mat-label>
        <input matInput />
      </mat-form-field>
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
      <mat-form-field class="w-full">
        <mat-label>Confirm Password</mat-label>
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
      <mat-card-actions class="mt-2  flex items-center justify-center w-full">
        <button class="w-full button-small-rounded" matButton="outlined">Sign Up</button>
      </mat-card-actions>
      <div class="flex flex-row mt-10 items-center justify-center gap-1">
        <p>Already have an account?</p>
        <a routerLink="/auth/sign-in" class="cursor-pointer underline hover:opacity-80"
          >Sign In Now</a
        >
      </div>
    </div>
  `,
})
export class RegisterComponent {
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
