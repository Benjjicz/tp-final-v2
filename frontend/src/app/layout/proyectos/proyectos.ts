import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProyectoService } from '../../services/proyecto.service';
import { ClienteService } from '../../services/cliente.service'; 

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proyectos.html', 
  styleUrl: './proyectos.scss'     
})
export class Proyectos implements OnInit {
  proyectos: any[] = [];
  clientesActivos: any[] = []; 
  cargando = true;

  mostrarFormulario = false;
  nuevoNombre = '';
  nuevoClienteId: number | null = null; 

  mostrarFormularioEdicion = false;
  proyectoEditandoId: number | null = null;
  editNombre = '';
  editEstado = '';
  editClienteId: number | null = null;

  constructor(
    private proyectoService: ProyectoService,
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    
    this.proyectoService.obtenerProyectos().subscribe({
      next: (data) => {
        this.proyectos = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar proyectos:', err)
    });

    this.clienteService.obtenerClientes().subscribe({
      next: (data) => {
        this.clientesActivos = data.filter((c: any) => c.estado === 'ACTIVO');
      }
    });
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.mostrarFormularioEdicion = false;
    this.nuevoNombre = '';
    this.nuevoClienteId = null; 
  }

  guardarProyecto() {
    if (!this.nuevoNombre.trim()) {
      alert('El nombre del proyecto es obligatorio');
      return;
    }

    const nuevoProy: any = { nombre: this.nuevoNombre };
    
    // CORRECCIÓN MÁGICA: Ahora usamos 'idCliente' exactamente como dice tu backend
    if (this.nuevoClienteId !== null) {
      nuevoProy.idCliente = Number(this.nuevoClienteId);
    }

    this.proyectoService.crearProyecto(nuevoProy).subscribe({
      next: () => {
        this.toggleFormulario();
        this.cargarDatos();
      },
      error: (err) => {
        console.error(err);
        alert('Error al guardar el proyecto');
      }
    });
  }

  abrirEditar(proyecto: any) {
    this.mostrarFormularioEdicion = true;
    this.mostrarFormulario = false;
    this.proyectoEditandoId = proyecto.id;
    this.editNombre = proyecto.nombre;
    this.editEstado = proyecto.estado;
    // Extraemos el ID del cliente si es que el proyecto tiene uno
    this.editClienteId = proyecto.cliente ? proyecto.cliente.id : null; 
  }

  cancelarEdicion() {
    this.mostrarFormularioEdicion = false;
    this.proyectoEditandoId = null;
  }

  guardarEdicion() {
    if (!this.editNombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    const datosAct: any = {
      nombre: this.editNombre,
      estado: this.editEstado
    };
    
    // CORRECCIÓN MÁGICA: Ahora usamos 'idCliente' al actualizar también
    if (this.editClienteId !== null && this.editClienteId !== undefined) {
      datosAct.idCliente = Number(this.editClienteId);
    } else {
      // Si eligen "Proyecto Interno", mandamos nulo para desvincularlo
      datosAct.idCliente = null; 
    }

    this.proyectoService.actualizarProyecto(this.proyectoEditandoId!, datosAct).subscribe({
      next: () => {
        this.cancelarEdicion();
        this.cargarDatos();
      },
      error: (err) => {
        console.error(err);
        alert('Error al actualizar el proyecto');
      }
    });
  }
}