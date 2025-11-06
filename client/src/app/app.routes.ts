import { Routes } from '@angular/router';
import { RegisterComponent } from '../feature/auth/RegisterComponent';
import { LoginComponent } from '../feature/auth/LoginComponent';
import { AuthLayoutComponent } from '../feature/auth/layout/AuthComponent';
import { ForgotPassword } from '../feature/auth/ForgotPassword';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      {
        path: 'sign-up',
        component: RegisterComponent,
      },
      { path: 'sign-in', component: LoginComponent },
    ],
  },
  { path: 'forgot-password', component: ForgotPassword },
];
