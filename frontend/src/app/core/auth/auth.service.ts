import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1/auth';

  constructor(private http: HttpClient) { }

  login(nombre: string, clave: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { nombre, clave });
  }

  guardarToken(token: string) {
    localStorage.setItem('token', token);
  }

  
  cerrarSesion() {
    localStorage.removeItem('token');
  }
}