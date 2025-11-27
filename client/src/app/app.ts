import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main class=" w-screen min-h-screen">
      <router-outlet />
    </main>
  `,
  styles: [],
})
export class App {}
