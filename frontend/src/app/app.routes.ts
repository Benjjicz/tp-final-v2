import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { DashboardComponent } from './layout/dashboard/dashboard'; 
import { ClientesComponent } from './layout/clientes/clientes.component'; 
// CAMBIO AQUÍ: Importamos 'Proyectos' desde './layout/proyectos/proyectos'
import { Proyectos } from './layout/proyectos/proyectos'; 

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [ 
      { path: 'clientes', component: ClientesComponent },
      // CAMBIO AQUÍ: Usamos la clase 'Proyectos'
      { path: 'proyectos', component: Proyectos } 
    ]
  },
  { path: '**', redirectTo: 'login' }
];