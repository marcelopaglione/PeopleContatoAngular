import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagerPersonComponent } from './components/person/manage-person.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'person', component: ManagerPersonComponent},
  { path: 'home', component: HomeComponent},
  { path: 'person/:id', component: ManagerPersonComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
