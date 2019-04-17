import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { ManagerPersonComponent } from './manage-person.component';
import { TitleComponent } from '../../shared/title/title.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AlertComponent } from '../../shared/alert/alert.component';
import { RouterModule, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { MockPeopleApiService } from 'src/app/services/MockPeopleApiService';
import { Person, Contato } from 'src/app/Entities';
import { dateValidator } from '../../shared/forms/date.validator';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
describe('ManagerPersonComponent', () => {
  let component: ManagerPersonComponent;
  let fixture: ComponentFixture<ManagerPersonComponent>;
  let router: Router;

  let mockPerson: Person;
  let mockContato: Contato;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        RouterModule,
        RouterTestingModule,
        NgbModule
      ],
      declarations: [
        ManagerPersonComponent,
        TitleComponent,
        AlertComponent,
      ],
      providers: [{ provide: PeopleApiService, useClass: MockPeopleApiService }, dateValidator]
    }).compileComponents();
    router = TestBed.get(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockPerson = {id: null, name: 'Person name', rg: '101010', birthDate: new Date('1500-01-31')};
    mockContato = {id: 0, name: 'Seu Aparecido', person: mockPerson};
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();

    jasmine.getEnv().addReporter({
      specStarted(result) {
        console.log(result.fullName);
      }
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shouldn not save form with null birthDate', () => {
    component.fg.patchValue(mockPerson);
    component.fg.patchValue({ birthDate: null });
    expect(component.fg.valid).toBeFalsy();
  });

  it('shouldn not save form with empty name', () => {
    component.initializePageContent();
    component.fg.patchValue(mockPerson);
    component.fg.patchValue({ name: '' });
    expect(component.fg.valid).toBeFalsy();
  });

  it('shouldn not save form with empty rg', () => {
    component.fg.patchValue(mockPerson);
    component.fg.patchValue({ rg: '' });
    expect(component.fg.valid).toBeFalsy();
  });

  it('shouldn not save form with invalid birthDate', () => {
    component.fg.patchValue(mockPerson);
    component.fg.patchValue({ birthDate: '12/31/2015' });
    expect(component.fg.valid).toBeFalsy();
  });

  it('should set title to edit person when page receive a id parameter', () => {
    component.idFromUrlParam  = 1;
    component.ngOnInit();
    expect(component.title).toEqual('Editar Pessoa');
  });

  it('shouldn not save form with contatos with empty name ', () => {
    component.fg.patchValue(mockPerson);
    component.appAddContatoComponent();
    expect(component.contatos.length).toBe(1);

    component.save();
    fixture.detectChanges();
    expect(component.response.status).toEqual('warning');
    expect(component.response.message).toEqual('Preencha o nome de todos os contatos');
  });

  it('should save a person with no contatos', () => {
    component.fg.patchValue(mockPerson);
    component.save();
    fixture.detectChanges();
    expect(component.response.status).toBe('success');
  });

  it('should save a person with 1 new contatos', () => {
    component.fg.patchValue(mockPerson);
    component.appAddContatoComponent(mockContato);
    component.save();
    fixture.detectChanges();
    expect(component.response.status).toBe('success');
  });

  it('should load the person from parameter id', () => {
    component.idFromUrlParam = 1;
    mockPerson.id = 1;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.fg.value.id).toEqual(mockPerson.id);
    expect(component.fg.value.name).toEqual(mockPerson.name);
  });

  it('should be able to navigate to `/home`', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.navigateBack();
    expect(navigateSpy).toHaveBeenCalledWith(['home']);
  });

  it('should remove visual contato', () => {
    component.appAddContatoComponent(mockContato);
    expect(component.contatos.length).toBe(1);
    // confirm click to delete the contato
    spyOn(window, 'confirm').and.returnValue(true);
    component.removeContato(mockContato);
    expect(window.confirm).toHaveBeenCalledWith(`Você tem certeza que deseja remover ${mockContato.name}`);
    expect(component.contatos.length).toBe(0);
  });

  it('should remove contato from database and return 200', () => {
    mockContato.id = 1;
    component.appAddContatoComponent(mockContato);
    expect(component.contatos.length).toBe(1);
    // confirm click to delete the contato
    spyOn(window, 'confirm').and.returnValue(true);
    component.removeContato(mockContato);
    expect(window.confirm).toHaveBeenCalledWith(`Você tem certeza que deseja remover ${mockContato.name}`);
    expect(component.contatos.length).toBe(0);
    expect(component.response.status).toEqual('success');
  });

  it('should remove contato from database and return 404', () => {
    mockContato.id = null;
    component.appAddContatoComponent(mockContato);
    expect(component.contatos.length).toBe(1);
    // confirm click to delete the contato
    spyOn(window, 'confirm').and.returnValue(true);
    component.removeContato(mockContato);
    expect(window.confirm).toHaveBeenCalledWith(`Você tem certeza que deseja remover ${mockContato.name}`);
    expect(component.contatos.length).toBe(1);
    expect(component.response.status).toEqual('warning');
  });

  it('should remove cancel a contato removal', () => {
    mockContato.id = 1;
    component.appAddContatoComponent(mockContato);
    expect(component.contatos.length).toBe(1);
    // confirm click to delete the contato
    spyOn(window, 'confirm').and.returnValue(false);
    component.removeContato(mockContato);
    expect(window.confirm).toHaveBeenCalledWith(`Você tem certeza que deseja remover ${mockContato.name}`);
    expect(component.contatos.length).toBe(1);
  });

});
