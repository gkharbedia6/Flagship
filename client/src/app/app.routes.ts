import { Routes } from '@angular/router';
import { AuthGuard } from '../utils/guards/auth.guard';
import { SignInComponent } from '../feature/auth/sign-in.component';
import { SignUpComponent } from '../feature/auth/sign-up.component';
import { GuestGuard } from '../utils/guards/guest.guard';
import { VerifyEmailGuard } from '../utils/guards/verify-email.guard';
import { AuthLayoutComponent } from '../feature/auth/layout/auth.component';
import { ShellComponent } from '../feature/shell.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [GuestGuard],
    children: [
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      {
        path: 'sign-up',
        component: SignUpComponent,
      },
      { path: 'sign-in', component: SignInComponent },
      {
        path: 'verify-email',
        loadComponent: () =>
          import('../feature/auth/verify-email.component').then((c) => c.VerifyEmailComponent),
        canActivate: [VerifyEmailGuard],
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('../feature/auth/forgot-password/forgot-password.component').then(
            (c) => c.ForgotPassword
          ),
      },
    ],
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import(`../feature/landing/landing.component`).then((c) => c.LandingComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import(`../feature/profile/profile.component`).then((c) => c.ProfileComponent),
      },
    ],
  },
];
