import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  // Aquí declaramos la variable que Angular estaba buscando
  nombreUsuario: string = 'Usuario'; 

  constructor(private router: Router) {}

  ngOnInit() {
    this.extraerNombreDelToken();
  }

  extraerNombreDelToken() {
    // Verificamos que estamos en el navegador para evitar errores
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token'); 
      
      if (token) {
        try {
          // Desencriptamos el JWT para sacar el nombre real
          const payloadBase64 = token.split('.')[1]; 
          const payloadDecodificado = JSON.parse(atob(payloadBase64)); 
          this.nombreUsuario = payloadDecodificado.nombre; 
        } catch (e) {
          console.error('No se pudo decodificar el token', e);
        }
      }
    }
  }

  cerrarSesion() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
    }
    this.router.navigate(['/login']);
  }
}