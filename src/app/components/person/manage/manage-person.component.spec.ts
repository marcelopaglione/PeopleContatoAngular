import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerPersonComponent } from './manage-person.component';
import { TitleComponent } from '../../shared/title/title.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AlertComponent } from '../../shared/alert/alert.component';
import { RouterModule, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { NewContatoComponent } from '../../contato/new-contato.component';
import { MockPeopleApiService } from 'src/app/services/MockPeopleApiService';
import { Person, Contato } from 'src/app/Entities';
import { ViewContainerRef } from '@angular/core';
describe('ManagerPersonComponent', () => {
  let component: ManagerPersonComponent;
  let service: PeopleApiService;
  let fixture: ComponentFixture<ManagerPersonComponent>;
  let router: Router;

  const mockPerson: Person = {id: null, name: 'Nova Pessoa Full Name', rg: '1597534682', birthDate: null};
  const mockContato: Contato = {id: 0, name: 'Seu Aparecido', person: mockPerson};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        RouterTestingModule
      ],
      declarations: [
        ManagerPersonComponent,
        TitleComponent,
        AlertComponent,
        NewContatoComponent
      ],
      providers: [{ provide: PeopleApiService, useClass: MockPeopleApiService }]
    }).compileComponents();
    router = TestBed.get(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.entry = TestBed.createComponent(ViewContainerRef).componentInstance;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shouldn not save form with null birthDate', done => {
    component.fg.patchValue(mockPerson);
    component.savePerson().subscribe(data => {
      expect(component.response.status).toEqual('warning');
      expect(component.response.message).toEqual('Formulário inválido');
      done();
    });
  });

  it('shouldn not save form with empty name', done => {
    component.fg.patchValue(mockPerson);
    component.fg.patchValue({ name: '' });
    component.savePerson().subscribe(data => {
      expect(component.response.status).toEqual('warning');
      expect(component.response.message).toEqual('Formulário inválido');
      done();
    });
  });

  it('shouldn not save form with empty rg', done => {
    component.fg.patchValue(mockPerson);
    component.fg.patchValue({ rg: '' });
    component.savePerson().subscribe(data => {
      expect(component.response.status).toEqual('warning');
      expect(component.response.message).toEqual('Formulário inválido');
      done();
    });
  });

  it('shouldn not save form with invalid birthDate', done => {
    component.fg.patchValue(mockPerson);
    component.fg.patchValue({ birthDate: '31/31/1900' });
    component.savePerson().subscribe(data => {
      expect(component.response.status).toEqual('warning');
      expect(component.response.message).toEqual('Data de nascimento está inválida');
      done();
    });
  });

  it('shouldn not save form contatos and contato.name is empty', done => {
    component.fg.patchValue(mockPerson);
    component.fg.patchValue({ birthDate: '31/12/1990' });
    component.appAddContatoComponent();
    component.savePerson().subscribe(data => {
      expect(component.response.status).toEqual('warning');
      expect(component.response.message).toEqual('Data de nascimento está inválida');
      done();
    });
  });

  it('should save a person with no contatos', done => {
    component.fg.patchValue(mockPerson);
    component.fg.patchValue({ birthDate: '12/04/1900' });
    component.savePerson().subscribe(data => {
      console.log('save', data);
      expect(data.status).toEqual(201);
      done();
    });
  });

});
