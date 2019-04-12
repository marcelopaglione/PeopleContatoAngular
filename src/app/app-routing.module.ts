import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewContatoComponent } from './components/contato/new-contato/new-contato.component';
import { NewPersonComponent } from './components/person/new-person/new-person.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'newPerson', component: NewPersonComponent},
  { path: 'home', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
