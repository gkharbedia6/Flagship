import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { matchPasswordValidator } from '../../../../utils';

@Component({
  selector: 'recover-password',
  imports: [
    MatFormField,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <form class="flex flex-col gap-1 w-full" [formGroup]="recoverPassword" (ngSubmit)="onSubmit()">
      <mat-form-field class="w-full">
        <mat-label>Password</mat-label>
        <input formControlName="password" matInput [type]="hide() ? 'password' : 'text'" />
        <button
          matIconButton
          matSuffix
          (click)="showPassword($event)"
          [attr.aria-label]="'Hide password'"
          [attr.aria-pressed]="hide()"
          type="button"
        >
          <mat-icon>{{ hide() ? 'visibility_off' : 'visibility' }}</mat-icon>
        </button>
        @if (this.recoverPassword.controls['password'].hasError('required')) {
        <mat-error>Password is required. </mat-error>
        } @else if (this.recoverPassword.controls['password'].hasError('minlength')) {
        <mat-error>Password must be minimum 6 characters.</mat-error>
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
          type="button"
        >
          <mat-icon>{{ hide() ? 'visibility_off' : 'visibility' }}</mat-icon>
        </button>
        @if (this.recoverPassword.controls['confirmPassword'].hasError('required')) {
        <mat-error>Password is required. </mat-error>
        } @else if (this.recoverPassword.controls['confirmPassword'].hasError('passwordMismatch')) {
        <mat-error>Passwords do not match. </mat-error>

        }
      </mat-form-field>
      <mat-card-actions class="mt-2  flex items-center justify-center w-full">
        <button type="submit" class="w-full" matButton="outlined">
          @if(false) {
          <mat-icon fontSet="material-symbols-outlined" class="!m-0 animate-spin"
            >progress_activity</mat-icon
          >

          } @else { Reset password }
        </button>
      </mat-card-actions>
    </form>
  `,
})
export class RecoverPasswordComponent {
  hide = signal(true);
  showPassword(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  recoverPassword = new FormGroup(
    {
      password: new FormControl('123123', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('123123', [Validators.required]),
    },
    {
      validators: matchPasswordValidator,
    }
  );

  onSubmit() {
    if (!this.recoverPassword.valid) return;
    const { password } = this.recoverPassword.value;
    if (!password) return;
    console.log(password);
  }
}
