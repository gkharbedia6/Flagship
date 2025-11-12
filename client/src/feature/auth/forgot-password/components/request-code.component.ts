import { Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFacadeService } from '../../../../data/auth';

@Component({
  selector: 'request-code',
  imports: [
    MatFormField,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <form
      class="flex flex-col gap-1 w-full"
      [formGroup]="forgotPasswordForm"
      (ngSubmit)="onSubmit()"
    >
      <mat-form-field class="w-full">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" />
        @if (this.forgotPasswordForm.controls['email'].hasError('required')) {
        <mat-error>Email is required.</mat-error>
        }
      </mat-form-field>
      @if(this.authFacade.getError()) {
      <mat-error>{{ this.authFacade.getError()?.error.message }}</mat-error>
      }
      <mat-card-actions class="mt-2  flex items-center justify-center w-full">
        <button
          [disabled]="this.authFacade.getIsLoading()"
          type="submit"
          class="w-full"
          matButton="outlined"
        >
          <span>Send reset code</span>
          @if(this.authFacade.getIsLoading()) {
          <mat-icon fontSet="material-symbols-outlined" class="animate-spin"
            >progress_activity</mat-icon
          >
          }
        </button>
      </mat-card-actions>
    </form>
  `,
})
export class RequestCodeComponent {
  authFacade = inject(AuthFacadeService);
  forgotPasswordForm = new FormGroup({
    email: new FormControl('giorgikharbedia6@gmail.com', [Validators.required, Validators.email]),
  });

  onSubmit() {
    if (!this.forgotPasswordForm.valid) return;
    const { email } = this.forgotPasswordForm.value;
    if (!email) return;
    this.authFacade.requestForgotPasswordCode(email);
  }
}
