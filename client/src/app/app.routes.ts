import { Routes } from '@angular/router';
import { RegisterComponent } from '../feature/auth/Register.component';
import { LoginComponent } from '../feature/auth/Login.component';
import { AuthLayoutComponent } from '../feature/auth/layout/Auth.component';
import { ForgotPassword } from '../feature/auth/ForgotPassword.component';
import { LandingComponent } from '../feature/landing/Landing.component';
import { AuthGuard } from '../utils/guards/auth.guard';

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
  {
    path: '',
    component: LandingComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'profile',
        loadComponent: () =>
          import(`../feature/profile/Profile.component`).then((c) => c.ProfileComponent),
      },
    ],
  },
];
