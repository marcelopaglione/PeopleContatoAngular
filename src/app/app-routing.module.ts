import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagerPersonComponent } from './components/person/manage/manage-person.component';
import { HomeComponent } from './components/home/home.component';
import { ViewPersonComponent } from './components/person/view/view-person.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'person', component: ManagerPersonComponent},
  { path: 'home', component: HomeComponent},
  { path: 'person/:id', component: ManagerPersonComponent},
  { path: 'details/:id', component: ViewPersonComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
