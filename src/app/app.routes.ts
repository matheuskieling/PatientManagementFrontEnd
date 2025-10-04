import { Routes } from '@angular/router';
import { Fichario } from './pages/fichario/fichario.component';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Financeiro } from './pages/financeiro/financeiro';

export const routes: Routes = [
  { path: '', redirectTo: 'fichario', pathMatch: 'full' },
  { path: 'fichario', component: Fichario },
  { path: 'financeiro', component: Financeiro },
  { path: 'login', component: Login },
  { path: 'protected/auth/register', component: Register }
];
