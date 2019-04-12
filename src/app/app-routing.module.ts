import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewContatoComponent } from './components/contato/new-contato/new-contato.component';
import { NewPersonComponent } from './components/person/new-person/new-person.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/novoJogo' },
  { path: 'newPerson', component: NewPersonComponent},
  { path: 'home', component: NewContatoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
