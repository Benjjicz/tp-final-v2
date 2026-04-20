import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private apiUrl = 'http://localhost:3000/api/v1/proyectos';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerProyectos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Al crear, el clienteId es opcional (puede ser undefined si es un proyecto interno)
  crearProyecto(proyecto: { nombre: string, clienteId?: number }): Observable<any> {
    return this.http.post<any>(this.apiUrl, proyecto, { headers: this.getHeaders() });
  }

  actualizarProyecto(id: number, proyecto: { nombre: string, estado: string, clienteId?: number }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, proyecto, { headers: this.getHeaders() });
  }
}