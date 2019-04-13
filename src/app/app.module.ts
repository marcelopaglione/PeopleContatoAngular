import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { NewPersonComponent } from './components/person/new-person.component';
import { TitleComponent } from './components/title/title.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './components/alert/alert.component';
import { HomeComponent } from './components/home/home.component';
import { NewContatoComponent } from './components/contato/new-contato.component';

@NgModule({
  declarations: [
    AppComponent,
    NewContatoComponent,
    MenuComponent,
    NewPersonComponent,
    TitleComponent,
    AlertComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  entryComponents: [NewContatoComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
