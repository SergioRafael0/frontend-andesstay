import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles: string[] = route.data['roles'] || [];
    const userRoles = this.userService.getRoles();
    const has = allowedRoles.some(r => userRoles.includes(r));
    if (has) return true;
    this.router.navigate(['/dashboard']);
    return false;
  }
}
