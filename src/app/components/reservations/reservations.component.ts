import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reservation, ReservationService } from '../../services/reservation.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Reservas</h1>

    <div class="card">
      <h3>Nueva reserva</h3>
      <form (submit)="createReservation($event)">
        <label>ID de unidad:</label>
        <input type="number" [(ngModel)]="newReservation.unitId" name="unitId" required>
        <label>Nombre del huésped:</label>
        <input type="text" [(ngModel)]="newReservation.guestName" name="guestName" required>
        <label>Check-in (yyyy-mm-dd):</label>
        <input type="date" [(ngModel)]="newReservation.checkIn" name="checkIn" required>
        <label>Check-out (yyyy-mm-dd):</label>
        <input type="date" [(ngModel)]="newReservation.checkOut" name="checkOut" required>
        <button class="btn" type="submit" style="margin-top: 12px;">Crear reserva</button>
        <span *ngIf="msg" [class]="msgType === 'error' ? 'error' : 'success'" style="margin-left: 12px;">{{ msg }}</span>
      </form>
    </div>

    <div class="card">
      <h3>Listado de reservas</h3>
      <p *ngIf="isHuesped()" style="color: #666; font-style: italic;">
        Como huésped solo verás tus propias reservas.
      </p>
      <table *ngIf="reservations.length > 0">
        <thead>
          <tr>
            <th>ID</th><th>Unidad</th><th>Huésped</th><th>Check-in</th><th>Check-out</th><th>Estado</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let r of reservations">
            <td>{{ r.id }}</td>
            <td>{{ r.unitId }}</td>
            <td>{{ r.guestName }}</td>
            <td>{{ r.checkIn }}</td>
            <td>{{ r.checkOut }}</td>
            <td><span class="status" [class]="'status-' + r.status">{{ r.status }}</span></td>
            <td>
              <ng-container *ngIf="isRecepOrAdmin()">
                <button class="btn" *ngIf="r.status === 'CREADA'" (click)="changeStatus(r.id!, 'CONFIRMADA')">Confirmar</button>
                <button class="btn" *ngIf="r.status === 'CONFIRMADA'" (click)="changeStatus(r.id!, 'CHECKIN_PENDIENTE')">Check-in</button>
                <button class="btn" *ngIf="r.status === 'CHECKIN_PENDIENTE'" (click)="changeStatus(r.id!, 'EN_ESTADIA')">En estadía</button>
                <button class="btn" *ngIf="r.status === 'EN_ESTADIA'" (click)="changeStatus(r.id!, 'CHECKOUT')">Check-out</button>
              </ng-container>
              <button class="btn btn-danger" *ngIf="r.status === 'CREADA' || r.status === 'CONFIRMADA'" (click)="changeStatus(r.id!, 'CANCELADA')">Cancelar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="reservations.length === 0">No hay reservas para mostrar.</p>
    </div>
  `
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  newReservation: Reservation = this.empty();
  msg = '';
  msgType: 'success' | 'error' = 'success';

  constructor(
    private service: ReservationService,
    private userService: UserService
  ) {}

  empty(): Reservation {
    return { unitId: 1, guestName: '', checkIn: '', checkOut: '', status: 'CREADA' };
  }

  ngOnInit() {
    this.newReservation.guestName = this.userService.getName();
    this.newReservation.guestOid = this.userService.getOid();
    this.load();
  }

  load() {
    this.service.list().subscribe({
      next: (data) => this.reservations = data,
      error: (e) => { this.msg = 'Error al cargar: ' + (e.error?.message || e.message); this.msgType = 'error'; }
    });
  }

  createReservation(ev: Event) {
    ev.preventDefault();
    this.newReservation.guestOid = this.userService.getOid();
    this.newReservation.guestName = this.userService.getName();
    this.service.create(this.newReservation).subscribe({
      next: (r) => {
        this.msg = 'Reserva #' + r.id + ' creada en estado ' + r.status;
        this.msgType = 'success';
        this.newReservation = this.empty();
        this.newReservation.guestName = this.userService.getName();
        this.newReservation.guestOid = this.userService.getOid();
        this.load();
      },
      error: (e) => { this.msg = 'Error: ' + (e.error?.message || e.message); this.msgType = 'error'; }
    });
  }

  changeStatus(id: number, status: string) {
    this.service.changeStatus(id, status).subscribe({
      next: () => { this.msg = 'Reserva #' + id + ' → ' + status; this.msgType = 'success'; this.load(); },
      error: (e) => { this.msg = 'Error: ' + (e.error?.message || e.message); this.msgType = 'error'; }
    });
  }

  isHuesped() { return this.userService.isHuesped(); }
  isRecepOrAdmin() { return this.userService.isRecepcionista() || this.userService.isAdmin(); }
}
