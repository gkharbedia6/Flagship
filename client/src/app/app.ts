import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main class="bg-[#F4F3F6] w-screen min-h-screen">
      <router-outlet />
    </main>
  `,
  styles: [],
})
export class App {}
