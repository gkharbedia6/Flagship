import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'verification-code-form',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormField,
    MatInputModule,
    MatCardModule,
  ],
  template: `
    <form class="flex flex-col gap-1 w-full" [formGroup]="form()" (ngSubmit)="onSubmit()">
      <mat-form-field class="w-full">
        <mat-label>Verification Code</mat-label>
        <input matInput formControlName="verificationCode" />
        @if (this.form().controls[formControlName()].hasError('required')) {
        <mat-error>Verification code is required.</mat-error>
        }
      </mat-form-field>
      @if(error()) {
      <mat-error>{{ error()?.error.message }}</mat-error>
      }
      <mat-card-actions class="mt-2  flex items-center justify-center w-full">
        <button [disabled]="isLoading()" type="submit" class="w-full" matButton="outlined">
          <span>{{ buttonName() }}</span>
          @if(isLoading()) {
          <mat-icon fontSet="material-symbols-outlined" class=" animate-spin"
            >progress_activity</mat-icon
          >

          }
        </button>
      </mat-card-actions>
    </form>
  `,
})
export class VeirificationCodeForm {
  form = input.required<FormGroup>();
  formControlName = input.required<string>();
  error = input.required<HttpErrorResponse | null>();
  isLoading = input.required<boolean>();
  buttonName = input<string>('Send');
  formSubmit = output();

  onSubmit() {
    this.formSubmit.emit();
  }
}
