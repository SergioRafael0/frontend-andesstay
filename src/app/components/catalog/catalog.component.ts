import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Unit, CatalogService } from '../../services/catalog.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Catálogo de unidades</h1>

    <div class="card">
      <h3>Nueva unidad</h3>
      <form (submit)="createUnit($event)">
        <label>Código:</label>
        <input type="text" [(ngModel)]="newUnit.code" name="code" placeholder="HAB-101" required>
        <label>Tipo:</label>
        <select [(ngModel)]="newUnit.type" name="type">
          <option value="HABITACION">Habitación</option>
          <option value="CABANA">Cabaña</option>
        </select>
        <label>Capacidad:</label>
        <input type="number" [(ngModel)]="newUnit.capacity" name="capacity" required>
        <label>Precio por noche (CLP):</label>
        <input type="number" [(ngModel)]="newUnit.pricePerNight" name="price" required>
        <label>¿Disponible?</label>
        <select [(ngModel)]="newUnit.available" name="available">
          <option [ngValue]="true">Sí</option>
          <option [ngValue]="false">No</option>
        </select>
        <button class="btn" type="submit" style="margin-top: 12px;">Crear unidad</button>
        <span *ngIf="msg" [class]="msgType === 'error' ? 'error' : 'success'" style="margin-left: 12px;">{{ msg }}</span>
      </form>
    </div>

    <div class="card">
      <h3>Unidades registradas</h3>
      <table *ngIf="units.length > 0">
        <thead>
          <tr><th>ID</th><th>Código</th><th>Tipo</th><th>Capacidad</th><th>Precio</th><th>Disponible</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of units">
            <td>{{ u.id }}</td><td>{{ u.code }}</td><td>{{ u.type }}</td>
            <td>{{ u.capacity }}</td><td>$ {{ u.pricePerNight }}</td>
            <td>{{ u.available ? 'Sí' : 'No' }}</td>
            <td>
              <button class="btn" (click)="toggleAvailable(u)">{{ u.available ? 'Deshabilitar' : 'Habilitar' }}</button>
              <button class="btn btn-danger" (click)="deleteUnit(u.id!)" style="margin-left: 6px;">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="units.length === 0">No hay unidades en el catálogo.</p>
    </div>
  `
})
export class CatalogComponent implements OnInit {
  units: Unit[] = [];
  newUnit: Unit = this.empty();
  msg = '';
  msgType: 'success' | 'error' = 'success';

  constructor(
    private service: CatalogService,
    public userService: UserService
  ) {}

  empty(): Unit {
    return { code: '', type: 'HABITACION', capacity: 2, pricePerNight: 50000, available: true };
  }

  ngOnInit() { this.load(); }

  load() {
    this.service.list().subscribe({
      next: (data) => this.units = data,
      error: (e) => { this.msg = 'Error: ' + (e.error?.message || e.message); this.msgType = 'error'; }
    });
  }

  createUnit(ev: Event) {
    ev.preventDefault();
    this.service.create(this.newUnit).subscribe({
      next: (u) => { this.msg = 'Unidad #' + u.id + ' creada'; this.msgType = 'success'; this.newUnit = this.empty(); this.load(); },
      error: (e) => { this.msg = 'Error: ' + (e.error?.message || e.message); this.msgType = 'error'; }
    });
  }

  toggleAvailable(u: Unit) {
    this.service.update(u.id!, { ...u, available: !u.available }).subscribe({
      next: () => this.load(),
      error: (e) => { this.msg = 'Error: ' + (e.error?.message || e.message); this.msgType = 'error'; }
    });
  }

  deleteUnit(id: number) {
    if (!confirm('¿Eliminar unidad #' + id + '?')) return;
    this.service.delete(id).subscribe({
      next: () => { this.msg = 'Unidad eliminada'; this.msgType = 'success'; this.load(); },
      error: (e) => { this.msg = 'Error: ' + (e.error?.message || e.message); this.msgType = 'error'; }
    });
  }
}
