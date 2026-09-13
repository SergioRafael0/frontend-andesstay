import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { UserService } from './services/user.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <nav *ngIf="account">
      <div>
        <strong>AndesStay</strong>
        <a routerLink="/dashboard">Dashboard</a>
        <a routerLink="/reservations" *ngIf="hasAnyRole(['Huesped','Recepcionista','Admin'])">Reservas</a>
        <a routerLink="/catalog" *ngIf="hasAnyRole(['Recepcionista','Admin'])">Catálogo</a>
      </div>
      <div>
        <span>{{ userName }} <span class="role-badge">{{ userRole }}</span></span>
        <button class="btn btn-secondary" style="margin-left: 12px;" (click)="logout()">Cerrar sesión</button>
      </div>
    </nav>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent implements OnInit {
  account: any = null;
  userName = '';
  userRole = '';

  constructor(
    private msalService: MsalService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.msalService.instance.handleRedirectObservable().subscribe({
      next: (result) => {
        if (result?.account) {
          this.msalService.instance.setActiveAccount(result.account);
          this.setAccount(result.account);
        } else {
          const active = this.msalService.instance.getActiveAccount();
          if (active) this.setAccount(active);
        }
      },
      error: (err) => console.error('MSAL redirect error', err)
    });

    const active = this.msalService.instance.getActiveAccount();
    if (active) this.setAccount(active);
  }

  setAccount(account: any) {
    this.account = account;
    this.userService.setAccount(account);
    this.userName = this.userService.getName();
    this.userRole = this.userService.getRoles()[0] || '';
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(r => this.userService.hasRole(r));
  }

  login() {
    this.msalService.loginRedirect({ scopes: [environment.msal.apiScope] });
  }

  logout() {
    this.msalService.logoutRedirect();
  }
}
