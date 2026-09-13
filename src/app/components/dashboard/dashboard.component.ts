import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Bienvenido, {{ userName }} <span class="role-badge">{{ role }}</span></h1>

    <div class="card" *ngIf="isAdmin()">
      <h2>👑 Panel Administrador</h2>
      <p>Gestión completa del inventario de unidades hoteleras.</p>
      <ul>
        <li>Crear, editar y eliminar unidades (habitaciones/cabañas)</li>
        <li>Ver todas las reservas de todos los huéspedes</li>
        <li>Administrar tarifas y disponibilidad</li>
      </ul>
    </div>

    <div class="card" *ngIf="isRecepcionista()">
      <h2>🛎️ Panel Recepcionista</h2>
      <p>Gestión operativa de reservas y check-in/check-out.</p>
      <ul>
        <li>Confirmar reservas pendientes</li>
        <li>Realizar check-in / check-out</li>
        <li>Ver todas las reservas y gestionar catálogo</li>
      </ul>
    </div>

    <div class="card" *ngIf="isHuesped()">
      <h2>🛏️ Panel Huésped</h2>
      <p>Crea y sigue tus reservas.</p>
      <ul>
        <li>Crear una nueva reserva</li>
        <li>Ver el estado de tus reservas</li>
        <li>Cancelar reservas aún no confirmadas</li>
      </ul>
    </div>

    <div class="card">
      <h3>Información técnica de la sesión</h3>
      <p><strong>Usuario (UPN):</strong> {{ email }}</p>
      <p><strong>Roles asignados:</strong> {{ roles.join(', ') || '—' }}</p>
      <p><strong>Object ID (oid):</strong> {{ oid }}</p>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  userName = '';
  email = '';
  roles: string[] = [];
  oid = '';
  role = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userName = this.userService.getName();
    this.email = this.userService.getEmail();
    this.roles = this.userService.getRoles();
    this.oid = this.userService.getOid();
    this.role = this.roles[0] || '';
  }

  isAdmin() { return this.userService.isAdmin(); }
  isRecepcionista() { return this.userService.isRecepcionista(); }
  isHuesped() { return this.userService.isHuesped(); }
}
