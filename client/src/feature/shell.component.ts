import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShellHeaderComponent } from './shared/feature/header';

@Component({
  selector: 'shell',
  imports: [RouterOutlet, ShellHeaderComponent],
  template: `
    <div>
      <shell-header />
      <router-outlet />
    </div>
  `,
})
export class ShellComponent {}
