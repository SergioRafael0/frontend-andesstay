import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Reservation {
  id?: number;
  unitId: number;
  guestName: string;
  guestOid?: string;
  checkIn: string;
  checkOut: string;
  status: 'CREADA' | 'CONFIRMADA' | 'CHECKIN_PENDIENTE' | 'EN_ESTADIA' | 'CHECKOUT' | 'CANCELADA';
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private baseUrl = `${environment.apiGateway.baseUrl}/api/reservations`;

  constructor(private http: HttpClient) {}

  list(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.baseUrl);
  }

  create(r: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.baseUrl, r);
  }

  changeStatus(id: number, newStatus: string): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.baseUrl}/${id}/status`, { status: newStatus });
  }
}
