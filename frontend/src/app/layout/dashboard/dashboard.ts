import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importamos las herramientas necesarias para el menú y el contenido central
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; 
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // Agregamos los módulos de rutas aquí para que funcionen en el HTML
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive], 
  templateUrl: './dashboard.html', 
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  cerrarSesion() {
    this.authService.cerrarSesion(); 
    this.router.navigate(['/login']); 
  }
 
}