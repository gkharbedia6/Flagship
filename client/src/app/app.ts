import { Component, inject, OnInit, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthFacadeService } from '../data/auth';
import { iUser } from '../types';
import { HttpRequestService } from '../data/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main class="bg-[#F4F3F6]">
      <router-outlet />
      {{ user()?.email }}
      <button (click)="logout()" class="bg-red-500 w-20 aspect-square texr-greed-500">
        Logout
      </button>
      <button (click)="test()" class="bg-red-500 w-20 aspect-square texr-greed-500">test</button>
    </main>
  `,
  styles: [],
})
export class App implements OnInit {
  private _authFacade = inject(AuthFacadeService);
  http = inject(HttpRequestService);
  user: WritableSignal<iUser | null> = this._authFacade.getCurrentUser();
  constructor() {}

  ngOnInit(): void {
    console.log(this.user());
    // this.user.set(null);
  }

  logout() {
    const currentUser = this.user();
    if (!currentUser) return;
    this._authFacade.logout(currentUser._id).subscribe();
  }

  test() {
    return this.http.post('auth/test', {}).subscribe();
  }
}
