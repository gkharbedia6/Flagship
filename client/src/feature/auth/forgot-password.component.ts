import { Component } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'forgot-password',
  imports: [MatFormField, MatInputModule],
  providers: [],
  template: `
    <div
      class="min-w-[500px] top-1/2  left-1/2 absolute -translate-x-1/2 -translate-y-1/2 px-20 py-10 flex flex-col items-center justify-center"
    >
      <div class="flex gap-2 mb-10 w-full flex-col items-start justify-start">
        <p class="m-0 text-lg text-black">Welcome back</p>
        <p class="m-0 text-sm text-black opacity-70">Sign in to your account</p>
        <mat-form-field class="w-full">
          <mat-label>Email</mat-label>
          <input matInput placeholder="Placeholder" />
        </mat-form-field>
      </div>
    </div>
  `,
})
export class ForgotPassword {}
