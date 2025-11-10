import { Component, inject, OnInit, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { matchPasswordValidator } from '../../utils';
import { HttpErrorResponse } from '@angular/common/http';
import { iUser } from '../../types';
import { AuthApiService } from '../../data/api';

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
    ReactiveFormsModule,
  ],
  template: `
    <div
      class="min-w-[500px] top-1/2  left-1/2 absolute -translate-x-1/2 -translate-y-1/2 px-20 py-10 flex flex-col items-center justify-center"
    >
      <div class="flex gap-2 mb-10 w-full flex-col items-start justify-start">
        <p class="m-0 text-lg text-black">Get started</p>
        <p class="m-0 text-sm text-black opacity-70">Create a new account</p>
      </div>
      <form class="flex flex-col gap-1 w-full" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <mat-form-field class="w-full">
          <mat-label>Username</mat-label>
          <input formControlName="username" matInput />
          @if (this.registerForm.controls['username'].hasError('required')) {
          <mat-error>Username is required. </mat-error>
          }
        </mat-form-field>
        <mat-form-field class="w-full">
          <mat-label>Email</mat-label>
          <input formControlName="email" matInput />
          @if (this.registerForm.controls['email'].hasError('required')) {
          <mat-error>Email is required. </mat-error>
          } @else if (this.registerForm.controls['email'].hasError('email')) {
          <mat-error>Email must be correct format.</mat-error>
          }
        </mat-form-field>
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
          @if (this.registerForm.controls['password'].hasError('required')) {
          <mat-error>Password is required. </mat-error>
          } @else if (this.registerForm.controls['password'].hasError('minlength')) {
          <mat-error>Password must be minimum 6 characters. </mat-error>
          }
        </mat-form-field>
        <mat-form-field class="w-full">
          <mat-label>Confirm Password</mat-label>
          <input formControlName="confirmPassword" matInput [type]="hide() ? 'password' : 'text'" />
          <button
            matIconButton
            matSuffix
            (click)="showPassword($event)"
            [attr.aria-label]="'Hide password'"
            [attr.aria-pressed]="hide()"
          >
            <mat-icon>{{ hide() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (this.registerForm.controls['confirmPassword'].hasError('required')) {
          <mat-error>Password is required. </mat-error>
          } @else if (this.registerForm.controls['confirmPassword'].hasError('passwordMismatch')) {
          <mat-error>Passwords do not match. </mat-error>

          }
        </mat-form-field>
        @if(this.registerError()) {
        <mat-error>{{ this.registerError()?.error.message }}</mat-error>
        }
        <mat-card-actions class="mt-2  flex items-center justify-center w-full">
          <button type="submit" class="w-full button-small-rounded" matButton="outlined">
            @if(this.isLoading()) {
            <mat-icon fontSet="material-symbols-outlined" class="!m-0 animate-spin"
              >progress_activity</mat-icon
            >

            } @else { Sign Up }
          </button>
        </mat-card-actions>
      </form>

      <div class="flex flex-row mt-10 items-center justify-center gap-1">
        <p>Already have an account?</p>
        <a routerLink="/auth/sign-in" class="cursor-pointer underline hover:opacity-80"
          >Sign In Now</a
        >
      </div>
    </div>
  `,
})
export class RegisterComponent implements OnInit {
  private _authApi = inject(AuthApiService);
  private router = inject(Router);
  hide = signal(true);
  isLoading = signal(false);
  showPassword(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  registerError = signal<HttpErrorResponse | null>(null);

  registerForm = new FormGroup(
    {
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    {
      validators: matchPasswordValidator,
    }
  );

  ngOnInit(): void {}

  onSubmit() {
    this.isLoading.set(true);
    if (!this.registerForm.valid) {
      this.isLoading.set(false);
      return;
    }
    const { username, email, password } = this.registerForm.value;
    if (!username || !email || !password) {
      this.isLoading.set(false);
      return;
    }
    this._authApi.register({ username, email, password }).subscribe({
      next: (response: iUser) => {
        console.log(response);
        this.registerError.set(null);
        this.isLoading.set(false);
        this.router.navigate(['/auth/sign-in']);
      },
      error: (error: any) => {
        this.isLoading.set(false);
        this.registerError.set(error);
      },
    });
  }
}
