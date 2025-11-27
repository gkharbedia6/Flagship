import { DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';
import { STORAGE } from '../auth/tokens/storage.token';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _PREFERRED_THEME = 'preferredTheme';
  theme = signal<'light' | 'dark' | 'system'>('system');

  doc = inject(DOCUMENT);
  private _storage = inject<Storage>(STORAGE);

  constructor() {
    effect(() => {
      if (this.theme() == 'dark') {
        this.doc.documentElement.classList.add('dark');
        this.doc.documentElement.classList.remove('light');
      } else if (this.theme() == 'light') {
        this.doc.documentElement.classList.add('light');
        this.doc.documentElement.classList.remove('dark');
      } else {
        this.doc.documentElement.classList.remove('light', 'dark');
      }
    });
  }

  setPreferredTheme(theme: 'light' | 'dark' | 'system') {
    this.theme.set(theme);
    this._storage.setItem(this._PREFERRED_THEME, theme);
  }

  clearPreferredTheme() {
    this.theme.set('system');
    this._storage.removeItem(this._PREFERRED_THEME);
  }

  getPreferredTheme() {
    const theme = this._storage.getItem(this._PREFERRED_THEME);
    if (!theme) return null;
    return theme;
  }

  initializeAppTheme() {
    const theme = this.getPreferredTheme();
    if (theme === 'dark') {
      this.theme.set('dark');
      this.doc.documentElement.classList.add('dark');
      this.doc.documentElement.classList.remove('light');
    } else if (theme === 'light') {
      this.theme.set('light');
      this.doc.documentElement.classList.add('light');
      this.doc.documentElement.classList.remove('dark');
    } else {
      this.theme.set('system');
      this.doc.documentElement.classList.remove('light', 'dark');
    }
  }
}
