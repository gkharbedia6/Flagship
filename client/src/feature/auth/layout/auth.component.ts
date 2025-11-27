import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'auth-layout',
  imports: [RouterOutlet],
  providers: [],
  template: `
    <div class="flex w-full flex-row h-screen">
      <div class="md:w-[50%] w-screen relative">
        <h1 class="p-8 italic text-2xl">flagship</h1>
        <router-outlet />
      </div>
      <div
        class="bg-[var(--mat-sys-on-background)] md:flex hidden md:w-[50%] h-full items-center justify-center p-20"
      >
        <h2 class="text-2xl text-[var(--mat-sys-background))] opacity-80">
          First time running @flagship in local. It just works.
        </h2>
      </div>
    </div>
  `,
})
export class AuthLayoutComponent {}
