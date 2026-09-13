import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Unit {
  id?: number;
  code: string;
  type: 'HABITACION' | 'CABANA';
  capacity: number;
  pricePerNight: number;
  available: boolean;
}

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private baseUrl = `${environment.apiGateway.baseUrl}/api/catalog/units`;

  constructor(private http: HttpClient) {}

  list(): Observable<Unit[]> { return this.http.get<Unit[]>(this.baseUrl); }
  create(u: Unit): Observable<Unit> { return this.http.post<Unit>(this.baseUrl, u); }
  update(id: number, u: Unit): Observable<Unit> { return this.http.put<Unit>(`${this.baseUrl}/${id}`, u); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/${id}`); }
}
