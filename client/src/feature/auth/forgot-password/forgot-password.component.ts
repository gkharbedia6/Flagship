import { Component, inject, signal } from '@angular/core';

import { RouterLink } from '@angular/router';
import { RequestCodeComponent } from './components/request-code.component';
import { RecoverPasswordComponent } from './components/recover-password.component';
import { SubmitCodeComponent } from './components/submit-code.component';
import { AuthFacadeService } from '../../../data/auth';

@Component({
  selector: 'forgot-password',
  imports: [RouterLink, RequestCodeComponent, RecoverPasswordComponent, SubmitCodeComponent],
  providers: [],
  template: `
    <div
      class="min-w-[500px] top-1/2  left-1/2 absolute -translate-x-1/2 -translate-y-1/2 px-20 py-10 flex flex-col items-center justify-center"
    >
      <div class="flex gap-2 mb-10 w-full flex-col items-start justify-start">
        <p class="m-0 text-lg text-black">
          @switch (this.authFacade.getForgotPasswordStep()) { @case ('request_code') {Forgot your
          password?} @case ('submit_code') {Forgot your password?} @case ('recover_password')
          {Change your password} }
        </p>
        <p class="m-0 text-sm text-black opacity-70">
          @switch (this.authFacade.getForgotPasswordStep()) { @case ('request_code') {Enter your
          email and we'll send you a link to code the password} @case ('submit_code') {Enter your
          email and we'll send you a link to code the password} @case ('recover_password') { Welcome
          back! Choose a new strong password and save it to proceed} }
        </p>
      </div>
      <div class="w-full">
        @switch (this.authFacade.getForgotPasswordStep()) { @case ("request_code") {
        <request-code />

        } @case ("submit_code") {
        <submit-code />

        } @case ("recover_password") {
        <recover-password />
        } }
      </div>
      @if(this.authFacade.getForgotPasswordStep() !== 'recover_password') {
      <div class="flex flex-row mt-10 items-center justify-center gap-1">
        <p>Already have an account?</p>
        <a routerLink="/auth/sign-in" class="cursor-pointer underline hover:opacity-80">Sign In</a>
      </div>
      }
    </div>
  `,
})
export class ForgotPassword {
  authFacade = inject(AuthFacadeService);

  constructor() {
    console.log(this.authFacade.getForgotPasswordStep());
  }
}
