import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { AuthService } from '../auth.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  nombre = ''; // <-- CORREGIDO: Cambiamos 'usuario' por 'nombre'
  clave = '';
  errorMensaje = ''; 

  constructor(
    private authService: AuthService, 
    private router: Router 
  ) {}

  iniciarSesion() {
    this.errorMensaje = ''; 

    // CORREGIDO: Aquí también enviamos this.nombre
    this.authService.login(this.nombre, this.clave).subscribe({
      next: (res: any) => { 
        this.authService.guardarToken(res.token);
        this.router.navigate(['/dashboard']); 
      },
      error: (err: any) => { 
        console.error('Error en login:', err);
        this.errorMensaje = 'Credenciales incorrectas o error de conexión.'; 
      }
    });
  }
}