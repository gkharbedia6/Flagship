import { Routes } from '@angular/router';
import { AuthLayoutComponent } from '../feature/auth/layout/Auth.component';
import { ForgotPassword } from '../feature/auth/forgot-password.component';
import { AuthGuard } from '../utils/guards/auth.guard';
import { SignInComponent } from '../feature/auth/sign-in.component';
import { SignUpComponent } from '../feature/auth/sign-up.component';
import { LandingComponent } from '../feature/landing/landing.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      {
        path: 'sign-up',
        component: SignUpComponent,
      },
      { path: 'sign-in', component: SignInComponent },
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
          import(`../feature/profile/profile.component`).then((c) => c.ProfileComponent),
      },
    ],
  },
];
