import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <-- Importamos ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  cargando = true;

  // Formulario Crear
  mostrarFormulario = false;
  nuevoNombre = '';

  // Formulario Editar
  mostrarFormularioEdicion = false;
  clienteEditandoId: number | null = null;
  editNombre = '';
  editEstado = '';

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef // <-- Lo inyectamos aquí
  ) {}

  // ¡ESTA ES LA LLAVE! Se ejecuta apenas entras a la pantalla
  ngOnInit() {
    console.log('1. Entrando a la pantalla de clientes...');
    this.cargarClientes();
  }

  cargarClientes() {
    this.cargando = true;
    console.log('2. Pidiendo clientes al backend...');
    
    this.clienteService.obtenerClientes().subscribe({
      next: (data) => {
        console.log('3. Datos recibidos:', data);
        this.clientes = data;
        this.cargando = false;
        
        // Obligamos a Angular a "repintar" la pantalla inmediatamente
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al cargar clientes desde OnInit:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --- SECCIÓN CREAR ---
  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.mostrarFormularioEdicion = false; 
    this.nuevoNombre = ''; 
  }

  guardarCliente() {
    if (!this.nuevoNombre.trim()) {
      alert('El nombre no puede estar vacío');
      return;
    }

    this.clienteService.crearCliente({ nombre: this.nuevoNombre }).subscribe({
      next: () => {
        this.toggleFormulario(); 
        this.cargarClientes();   
      },
      error: (err) => {
        console.error('Error al crear cliente', err);
        alert('Hubo un error al guardar el cliente');
      }
    });
  }

  // --- SECCIÓN EDITAR ---
  abrirEditar(cliente: any) {
    this.mostrarFormularioEdicion = true;
    this.mostrarFormulario = false; 
    this.clienteEditandoId = cliente.id;
    this.editNombre = cliente.nombre;
    this.editEstado = cliente.estado;
  }

  cancelarEdicion() {
    this.mostrarFormularioEdicion = false;
    this.clienteEditandoId = null;
  }

  guardarEdicion() {
    if (!this.editNombre.trim()) {
      alert('El nombre no puede estar vacío');
      return;
    }

    const datosActualizados = {
      nombre: this.editNombre,
      estado: this.editEstado
    };

    this.clienteService.actualizarCliente(this.clienteEditandoId!, datosActualizados).subscribe({
      next: () => {
        this.cancelarEdicion(); 
        this.cargarClientes();  
      },
      error: (err) => {
        console.error('Error al actualizar cliente', err);
        alert(err.error?.message || 'Hubo un error al actualizar el cliente. Revise si tiene proyectos asociados.');
      }
    });
  }
}