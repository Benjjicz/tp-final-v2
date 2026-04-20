import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TareaService } from '../../services/tarea.service';
import { ProyectoService } from '../../services/proyecto.service'; 

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tareas.html', 
  styleUrl: './tareas.scss'
})
export class Tareas implements OnInit {
  tareas: any[] = [];
  proyectosActivos: any[] = []; 
  cargando = true;

  mostrarFormulario = false;
  nuevaDescripcion = '';
  nuevoIdProyecto: number | null = null; 

  mostrarFormularioEdicion = false;
  tareaEditandoId: number | null = null;
  editDescripcion = '';
  editEstado = '';
  editIdProyecto: number | null = null;

  constructor(
    private tareaService: TareaService,
    private proyectoService: ProyectoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    
    this.tareaService.obtenerTareas().subscribe({
      next: (data) => {
        this.tareas = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar tareas:', err)
    });

    this.proyectoService.obtenerProyectos().subscribe({
      next: (data) => {
        this.proyectosActivos = data.filter((p: any) => p.estado === 'ACTIVO');
      }
    });
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.mostrarFormularioEdicion = false;
    this.nuevaDescripcion = '';
    this.nuevoIdProyecto = null; 
  }

  guardarTarea() {
    if (!this.nuevaDescripcion.trim()) {
      alert('La descripción de la tarea es obligatoria');
      return;
    }
    if (this.nuevoIdProyecto === null) {
      alert('Debes asignar la tarea a un proyecto');
      return;
    }

    // ACÁ ESTÁ EL PUENTE: Esto es lo que se envía al DTO del backend
    const nuevaTarea = { 
      descripcion: this.nuevaDescripcion,
      idProyecto: Number(this.nuevoIdProyecto) 
    };

    this.tareaService.crearTarea(nuevaTarea).subscribe({
      next: () => {
        this.toggleFormulario();
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error del backend:', err);
        alert('Error al guardar la tarea');
      }
    });
  }

  abrirEditar(tarea: any) {
    this.mostrarFormularioEdicion = true;
    this.mostrarFormulario = false;
    this.tareaEditandoId = tarea.id;
    this.editDescripcion = tarea.descripcion;
    this.editEstado = tarea.estado;
    this.editIdProyecto = tarea.proyecto ? tarea.proyecto.id : null; 
  }

  cancelarEdicion() {
    this.mostrarFormularioEdicion = false;
    this.tareaEditandoId = null;
  }

  guardarEdicion() {
    if (!this.editDescripcion.trim()) {
      alert('La descripción es obligatoria');
      return;
    }
    if (this.editIdProyecto === null) {
      alert('Debes asignar la tarea a un proyecto');
      return;
    }

    const datosAct = {
      descripcion: this.editDescripcion,
      estado: this.editEstado,
      idProyecto: Number(this.editIdProyecto)
    };

    this.tareaService.actualizarTarea(this.tareaEditandoId!, datosAct).subscribe({
      next: () => {
        this.cancelarEdicion();
        this.cargarDatos();
      },
      error: (err) => {
        console.error(err);
        alert('Error al actualizar la tarea');
      }
    });
  }

  eliminarTarea(id: number) {
    if(confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.tareaService.eliminarTarea(id).subscribe({
        next: () => this.cargarDatos(),
        error: (err) => alert('Error al eliminar la tarea')
      });
    }
  }
}