import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { DashboardComponent } from './layout/dashboard/dashboard'; 
import { ClientesComponent } from './layout/clientes/clientes.component'; 
import { Proyectos } from './layout/proyectos/proyectos'; 
import { Tareas } from './layout/tareas/tareas'; 

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [ 
      { path: 'clientes', component: ClientesComponent },
      { path: 'proyectos', component: Proyectos },
      { path: 'tareas', component: Tareas }
    ]
  },
  { path: '**', redirectTo: 'login' }
];