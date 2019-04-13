import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewPersonComponent } from './components/person/new-person.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'person', component: NewPersonComponent},
  { path: 'home', component: HomeComponent},
  { path: 'person/:id', component: NewPersonComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
