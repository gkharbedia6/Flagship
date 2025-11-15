import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'alert',
  imports: [MatIconModule],
  template: ` <div class="flex flex-row justify-between">
    {{ data.message }}
    @if(data.isLoading) {
    <mat-icon fontSet="material-symbols-outlined" class=" animate-spin">progress_activity</mat-icon>
    }
  </div>`,
})
export class AlertComponent {
  data = inject(MAT_SNACK_BAR_DATA);
}
