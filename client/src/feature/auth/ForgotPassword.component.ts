import { Component } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'forgot-password',
  imports: [MatFormField, MatInputModule],
  providers: [],
  template: ` <div class="flex w-full flex-row items-center justify-center h-screen">
    <div class="w-[400px]">
      <mat-form-field class="w-full">
        <mat-label>Email</mat-label>
        <input matInput placeholder="Placeholder" />
      </mat-form-field>
    </div>
  </div>`,
})
export class ForgotPassword {}
