import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="max-width: 500px; margin: 60px auto;">
      <div class="card" style="text-align: center;">
        <h1>🏔️ AndesStay</h1>
        <p>Sistema de reservas de habitaciones y cabañas</p>
        <p>EP1 — DSY1107 Cloud Native I</p>
        <button class="btn" (click)="login()" style="margin-top: 20px; padding: 12px 32px; font-size: 16px;">
          Iniciar sesión con Microsoft
        </button>
        <p style="margin-top: 20px; color: #666; font-size: 13px;">
          Tenant: {{ tenantId }}<br>
          Cliente: {{ clientId }}
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  tenantId = environment.msal.tenantId;
  clientId = environment.msal.clientId;

  constructor(
    private msalService: MsalService,
    private userService: UserService,
    private router: Router
  ) {}

  login() {
    this.msalService.loginRedirect({ scopes: [environment.msal.apiScope] });
  }
}
