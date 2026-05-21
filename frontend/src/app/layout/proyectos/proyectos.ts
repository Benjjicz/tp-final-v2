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

  // ESTA ES LA VARIABLE NUEVA PARA EL BUSCADOR
  terminoBusqueda = '';

  mostrarFormulario = false;
  nuevoNombre = '';
  nuevoIdCliente: number | null = null; 

  mostrarFormularioEdicion = false;
  proyectoEditandoId: number | null = null;
  editNombre = '';
  editEstado = '';
  editIdCliente: number | null = null;

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

  // ¡ESTA ES LA FUNCIONALIDAD EXTRA! Filtra en tiempo real.
  get proyectosFiltrados() {
    if (!this.terminoBusqueda) {
      return this.proyectos;
    }
    return this.proyectos.filter(p => 
      p.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.mostrarFormularioEdicion = false;
    this.nuevoNombre = '';
    this.nuevoIdCliente = null; 
  }

  guardarProyecto() {
    if (!this.nuevoNombre.trim()) {
      alert('El nombre del proyecto es obligatorio');
      return;
    }
    const nuevoProyecto: any = { nombre: this.nuevoNombre };
    if (this.nuevoIdCliente) {
      nuevoProyecto.idCliente = Number(this.nuevoIdCliente);
    }

    this.proyectoService.crearProyecto(nuevoProyecto).subscribe({
      next: () => {
        this.toggleFormulario();
        this.cargarDatos();
      },
      error: (err) => alert('Error al guardar el proyecto')
    });
  }

  abrirEditar(proyecto: any) {
    this.mostrarFormularioEdicion = true;
    this.mostrarFormulario = false;
    this.proyectoEditandoId = proyecto.id;
    this.editNombre = proyecto.nombre;
    this.editEstado = proyecto.estado;
    this.editIdCliente = proyecto.cliente ? proyecto.cliente.id : null; 
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
      estado: this.editEstado,
      idCliente: this.editIdCliente ? Number(this.editIdCliente) : null
    };

    this.proyectoService.actualizarProyecto(this.proyectoEditandoId!, datosAct).subscribe({
      next: () => {
        this.cancelarEdicion();
        this.cargarDatos();
      },
      error: (err) => alert('Error al actualizar el proyecto')
    });
  }
}