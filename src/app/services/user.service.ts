import { Injectable } from '@angular/core';
import { AccountInfo } from '@azure/msal-browser';

@Injectable({ providedIn: 'root' })
export class UserService {
  private account: AccountInfo | null = null;

  setAccount(account: AccountInfo | null) {
    this.account = account;
  }

  getAccount(): AccountInfo | null {
    return this.account;
  }

  getName(): string {
    if (!this.account) return 'Invitado';
    return this.account.name || this.account.username || 'Usuario';
  }

  getEmail(): string {
    if (!this.account) return '';
    return this.account.username || '';
  }

  getRoles(): string[] {
    if (!this.account) return [];
    const claims: any = this.account.idTokenClaims;
    if (!claims) return [];
    if (Array.isArray(claims.roles)) return claims.roles;
    if (typeof claims.roles === 'string') return [claims.roles];
    return [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  isAdmin(): boolean { return this.hasRole('Admin'); }
  isRecepcionista(): boolean { return this.hasRole('Recepcionista'); }
  isHuesped(): boolean { return this.hasRole('Huesped'); }

  getOid(): string {
    if (!this.account) return '';
    const claims: any = this.account.idTokenClaims;
    return claims?.oid || claims?.sub || '';
  }
}
