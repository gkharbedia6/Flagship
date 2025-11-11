import { Component, inject, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthFacadeService } from '../../data/auth';

@Component({
  selector: 'auth-sign-in',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    RouterLink,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
  ],
  template: `
    <div
      class="min-w-[500px] top-1/2  left-1/2 absolute -translate-x-1/2 -translate-y-1/2 px-20 py-10 flex flex-col items-center justify-center"
    >
      <div class="flex gap-2 mb-10 w-full flex-col items-start justify-start">
        <p class="m-0 text-lg text-black">Welcome back</p>
        <p class="m-0 text-sm text-black opacity-70">Sign in to your account</p>
      </div>
      <form class="flex flex-col gap-1 w-full" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <mat-form-field class="w-full">
          <mat-label>Email</mat-label>
          <input formControlName="email" matInput />
          @if (this.loginForm.controls['email'].hasError('required')) {
          <mat-error>Email is required. </mat-error>
          } @else if (this.loginForm.controls['email'].hasError('email')) {
          <mat-error>Email must be correct format.</mat-error>
          }
        </mat-form-field>
        <div class="w-full flex flex-row justify-end">
          <a routerLink="/forgot-password" class="m-0 mb-2 cursor-pointer hover:opacity-80"
            >Forgot Password?</a
          >
        </div>

        <mat-form-field class="w-full">
          <mat-label>Password</mat-label>
          <input formControlName="password" matInput [type]="hide() ? 'password' : 'text'" />
          <button
            matIconButton
            matSuffix
            (click)="showPassword($event)"
            [attr.aria-label]="'Hide password'"
            [attr.aria-pressed]="hide()"
          >
            <mat-icon>{{ hide() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (this.loginForm.controls['password'].hasError('required')) {
          <mat-error>Password is required. </mat-error>
          }
        </mat-form-field>
        @if(this.authFacade.getError()) {
        <mat-error>{{ this.authFacade.getError()?.error.message }}</mat-error>
        }
        <mat-card-actions class="mt-2 flex items-center justify-center w-full">
          <button type="submit" matButton="outlined" class="button-small-rounded w-full">
            @if(this.authFacade.getIsLoading()) {
            <mat-icon fontSet="material-symbols-outlined" class="!m-0 animate-spin"
              >progress_activity</mat-icon
            >

            } @else { Sign In }
          </button>
        </mat-card-actions>
      </form>

      <div class="flex flex-row items-center mt-10 justify-center gap-1">
        <p>Don't have an account?</p>
        <a routerLink="/auth/sign-up" class="cursor-pointer underline hover:opacity-80"
          >Sign Up Now</a
        >
      </div>
    </div>
  `,
})
export class SignInComponent {
  authFacade = inject(AuthFacadeService);

  hide = signal(true);
  showPassword(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  loginForm = new FormGroup({
    email: new FormControl('gasana@gmail.com', [Validators.email, Validators.required]),
    password: new FormControl('123123', Validators.required),
  });

  onSubmit() {
    if (!this.loginForm.valid) return;
    const { email, password } = this.loginForm.value;
    if (!email || !password) return;

    this.authFacade.signIn(email, password);
  }
}
