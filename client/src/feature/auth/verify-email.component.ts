import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthFacadeService } from '../../data/auth';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'verify-email',
  imports: [
    MatFormField,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  providers: [],
  template: `
    <div
      class="min-w-[500px] top-1/2  left-1/2 absolute -translate-x-1/2 -translate-y-1/2 px-20 py-10 flex flex-col items-center justify-center"
    >
      <div class="flex gap-2 mb-10 w-full flex-col items-start justify-start">
        <p class="m-0 text-lg text-black">Verify your account</p>
        <p class="m-0 text-sm text-black opacity-70">Verification code was sent to your email</p>
      </div>
      <form
        class="flex flex-col gap-1 w-full"
        [formGroup]="verifyEmailForm"
        (ngSubmit)="onSubmit()"
      >
        <mat-form-field class="w-full">
          <mat-label>Verification Code</mat-label>
          <input matInput formControlName="verificationCode" />
          @if (this.verifyEmailForm.controls['verificationCode'].hasError('required')) {
          <mat-error>Verification code is required. </mat-error>
          }
        </mat-form-field>
        @if(this.authFacade.getError()) {
        <mat-error>{{ this.authFacade.getError()?.error.message }}</mat-error>
        }
        <mat-card-actions class="mt-2  flex items-center justify-center w-full">
          <button type="submit" class="w-full button-small-rounded" matButton="outlined">
            @if(this.authFacade.getIsLoading()) {
            <mat-icon fontSet="material-symbols-outlined" class="!m-0 animate-spin"
              >progress_activity</mat-icon
            >

            } @else { Verify }
          </button>
        </mat-card-actions>
      </form>
    </div>
  `,
})
export class VerifyEmailComponent implements OnInit {
  authFacade = inject(AuthFacadeService);
  verifyEmailForm: FormGroup;

  constructor() {
    this.verifyEmailForm = new FormGroup({
      verificationCode: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (!this.verifyEmailForm.valid) return;
    const { verificationCode } = this.verifyEmailForm.value;
    if (!verificationCode) return;
    this.authFacade.verifyEmail(verificationCode);
  }
}
