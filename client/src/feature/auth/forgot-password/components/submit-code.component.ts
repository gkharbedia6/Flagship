import { Component, inject } from '@angular/core';
import { VeirificationCodeForm } from '../../components/verification-code-form.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthFacadeService } from '../../../../data/auth';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'submit-code',
  imports: [VeirificationCodeForm, MatCardModule, MatIconModule],
  template: `
    <div class="w-full flex flex-col gap-10">
      <mat-card appearance="outlined">
        <mat-card-header class="flex flex-row gap-4 justify-start ">
          <div class="flex flex-col items-start relative  justify-start text-xs">
            <mat-icon fontSet="material-symbols-outlined" class="absolute top-0 -left-4"
              >info</mat-icon
            >
            <mat-card-content class="pt-0! text-sm"
              >Check your email for reset code</mat-card-content
            >
            <mat-card-content class="pt-0! opacity-80">
              You'll receive an email if an account associated with the email address exists
            </mat-card-content>
          </div>
        </mat-card-header>
      </mat-card>

      <verification-code-form
        [form]="submitCodeForm"
        [formControlName]="'verificationCode'"
        [error]="this.authFacade.getError()"
        [isLoading]="this.authFacade.getIsLoading()"
        [buttonName]="'Confirm reset code'"
        (formSubmit)="onSubmit()"
      />
    </div>
  `,
})
export class SubmitCodeComponent {
  authFacade = inject(AuthFacadeService);
  submitCodeForm: FormGroup;

  constructor() {
    this.submitCodeForm = new FormGroup({
      verificationCode: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (!this.submitCodeForm.valid) return;
    const { verificationCode } = this.submitCodeForm.value;
    if (!verificationCode) return;
    this.authFacade.submitForgotPasswordCode(verificationCode);
  }
}
