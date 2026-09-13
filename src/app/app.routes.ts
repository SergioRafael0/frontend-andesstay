import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'reservations', component: ReservationsComponent, canActivate: [AuthGuard] },
  { path: 'catalog', component: CatalogComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['Admin', 'Recepcionista'] } }
];
