import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private apiUrl = 'http://localhost:3000/api/v1/tareas';

  constructor(private http: HttpClient) {}

  obtenerTareas(idProyecto?: number): Observable<any[]> {
    let url = this.apiUrl;
    if (idProyecto) {
      url += `?idProyecto=${idProyecto}`;
    }
    return this.http.get<any[]>(url);
  }

  crearTarea(tarea: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tarea);
  }

  actualizarTarea(id: number, tarea: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, tarea);
  }

  eliminarTarea(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}