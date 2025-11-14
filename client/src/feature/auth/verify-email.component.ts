import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthFacadeService } from '../../data/auth';
import { VeirificationCodeForm } from './components/verification-code-form.component';

@Component({
  selector: 'verify-email',
  template: `
    <div
      class="min-w-[500px] top-1/2  left-1/2 absolute -translate-x-1/2 -translate-y-1/2 px-20 py-10 flex flex-col items-center justify-center"
    >
      <div class="flex gap-2 mb-10 w-full flex-col items-start justify-start">
        <p class="m-0 text-lg text-black">Verify your account</p>
        <p class="m-0 text-sm text-black opacity-70">Verification code was sent to your email</p>
      </div>
      <div class="w-full">
        <verification-code-form
          [form]="verifyEmailForm"
          [formControlName]="'verificationCode'"
          [error]="this.authFacade.getError()"
          [isLoading]="this.authFacade.getIsLoading()"
          [buttonName]="'Verify'"
          (formSubmit)="onSubmit()"
        />
      </div>
    </div>
  `,
  imports: [VeirificationCodeForm],
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
