import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/shared/menu/menu.component';
import { TitleComponent } from './components/shared/title/title.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './components/shared/alert/alert.component';
import { HomeComponent } from './components/home/home.component';
import { ManagerPersonComponent } from './components/person/manage/manage-person.component';
import { PaginationComponent } from './components/shared/pagination/pagination.component';
import { DetailsPersonComponent } from './components/person/details/details-person.component';
import { NgbModule, NgbDateParserFormatter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from './components/shared/forms/customDateParserFormatter';
import { NgbStringAdapter } from './components/shared/forms/ngbStringAdapter';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ManagerPersonComponent,
    TitleComponent,
    AlertComponent,
    HomeComponent,
    DetailsPersonComponent,
    PaginationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    { provide: NgbDateAdapter, useClass: NgbStringAdapter }],
  bootstrap: [AppComponent]
})
export class AppModule {}
