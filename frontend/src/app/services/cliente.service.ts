import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  // La URL apunta a tu backend (Puerto 3000 + Prefijo api + Versión v1 + Controlador clientes)
  private apiUrl = 'http://localhost:3000/api/v1/clientes';

  constructor(private http: HttpClient) { }

  /**
   * Genera las cabeceras necesarias para las peticiones protegidas.
   * Extrae el token JWT del localStorage y lo coloca como Bearer Token.
   */
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Obtiene la lista completa de clientes desde el backend.
   * Requiere estar autenticado.
   */
  obtenerClientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  /**
   * Envía los datos de un nuevo cliente al servidor.
   * @param cliente Objeto que contiene el nombre del cliente.
   */
  crearCliente(cliente: { nombre: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, cliente, { headers: this.getHeaders() });
  }

 /**
   * Actualiza los datos de un cliente existente.
   */
  actualizarCliente(id: number, cliente: { nombre: string, estado: string }): Observable<any> {
    // CAMBIAMOS patch POR put AQUÍ ABAJO 👇
    return this.http.put<any>(`${this.apiUrl}/${id}`, cliente, { headers: this.getHeaders() });
  }
}