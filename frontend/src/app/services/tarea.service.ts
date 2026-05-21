import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private apiUrl = 'http://localhost:3000/api/v1/tareas';

  constructor(private http: HttpClient) {}

  // Solución al Bug 4: Agregamos getHeaders
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerTareas(idProyecto?: number): Observable<any[]> {
    let url = this.apiUrl;
    if (idProyecto) {
      url += `?idProyecto=${idProyecto}`;
    }
    // Agregamos los headers en todas las peticiones
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }

  crearTarea(tarea: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tarea, { headers: this.getHeaders() });
  }

  actualizarTarea(id: number, tarea: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, tarea, { headers: this.getHeaders() });
  }

  eliminarTarea(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}