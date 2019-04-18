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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbStringAdapter } from '../../shared/forms/ngbStringAdapter';
import { CustomDateParserFormatter } from '../../shared/forms/customDateParserFormatter';
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
      providers: [{ provide: PeopleApiService, useClass: MockPeopleApiService }]
    }).compileComponents();
    router = TestBed.get(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockPerson = {id: null, name: 'Person name', rg: '10101010', birthDate: new Date(2019, 12, 31)};
    mockContato = {id: null, name: 'Seu Aparecido', person: mockPerson};
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

  it('should set title to edit person when page receive a id parameter', () => {
    component.idFromUrlParam  = 1;
    component.ngOnInit();
    expect(component.title).toEqual('Editar Pessoa');
  });

  it('shouldn not save form with contatos with empty name ', () => {
    mockPerson.name = '';
    component.fg.patchValue(mockPerson);
    component.appAddContatoComponent();
    expect(component.contatos.length).toBe(1);

    component.save();
    fixture.detectChanges();
    expect(component.response.status).toEqual('');
  });

  it('should save a person with no contatos', () => {
    patchPersonFormGroup(component, mockPerson);
    fixture.detectChanges();
    component.save();
    fixture.detectChanges();
    expect(component.response.status).toBe('success');
  });

  it('should save a person with 1 new contatos', () => {
    mockPerson.id = 0;
    patchPersonFormGroup(component, mockPerson);
    expect(component.fg.valid).toBeTruthy();

    mockContato.id = 0;
    component.appAddContatoComponent(mockContato);
    expect(component.fg.valid).toBeTruthy();

    component.save();
    fixture.detectChanges();
    expect(component.response.status).toBe('success');
  });

  it('should update a person with 1 contato', () => {
    mockPerson.id = 14;
    patchPersonFormGroup(component, mockPerson);
    fixture.detectChanges();
    component.appAddContatoComponent(mockContato);
    expect(component.fg.valid).toBeTruthy();
    fixture.detectChanges();
    component.save();
    fixture.detectChanges();
    expect(component.response.status).toBe('success');
  });

  it('should load the person from parameter id', () => {
    component.idFromUrlParam = 1;
    mockPerson.id = 1;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.fg.get('person').value.id).toEqual(mockPerson.id);
    expect(component.fg.get('person').value.name).toEqual(mockPerson.name);
  });

  it('should be able to navigate to `/home`', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.navigateBack();
    expect(navigateSpy).toHaveBeenCalledWith(['home']);
  });

  it('should remove visual contato', () => {
    mockContato.id = 15;
    component.appAddContatoComponent(mockContato);
    expect(component.contatos.length).toBe(1);
    // confirm click to delete the contato
    spyOn(window, 'confirm').and.returnValue(true);
    component.removeContato(component.contatos.length - 1);
    expect(window.confirm).toHaveBeenCalledWith(`Você tem certeza que deseja remover ${mockContato.name}`);
    expect(component.contatos.length).toBe(0);
  });

  it('should remove contato from database and return 200', () => {
    mockContato.id = 1;
    component.appAddContatoComponent(mockContato);
    expect(component.contatos.length).toBe(1);
    // confirm click to delete the contato
    spyOn(window, 'confirm').and.returnValue(true);
    component.removeContato(component.contatos.length - 1);
    expect(window.confirm).toHaveBeenCalledWith(`Você tem certeza que deseja remover ${mockContato.name}`);
    expect(component.contatos.length).toBe(0);
    expect(component.response.status).toEqual('success');
  });

  it('should remove contato from whit empty id with no confirm question', () => {
    mockContato.id = null;
    component.appAddContatoComponent(mockContato);
    expect(component.contatos.length).toBe(1);
    component.removeContato(component.contatos.length - 1);
    expect(component.contatos.length).toBe(0);
    expect(component.response.status).toEqual('');
  });

  it('should remove cancel a contato removal', () => {
    mockContato.id = 1;
    component.appAddContatoComponent(mockContato);
    expect(component.contatos.length).toBe(1);
    // confirm click to delete the contato
    spyOn(window, 'confirm').and.returnValue(false);
    component.removeContato(component.contatos.length - 1);
    expect(window.confirm).toHaveBeenCalledWith(`Você tem certeza que deseja remover ${mockContato.name}`);
    expect(component.contatos.length).toBe(1);
  });

  it('should convert Date to datepicker', () => {
    // date = dd-(mm-1)-yyyy
    const date = new Date(2019, 0, 1);
    const datepickerFormat = {year: 2019, month: 1, day: 1};
    const dateString = '01-01-2019';

    const datePickerFormatter = new NgbStringAdapter();
    const customDateParser = new CustomDateParserFormatter();

    expect(customDateParser.format(datepickerFormat)).toEqual(dateString);
    expect(customDateParser.parse(dateString)).toEqual(datepickerFormat);
    expect(customDateParser.format(null)).toEqual(null);
    expect(customDateParser.parse(null)).toEqual(null);

    expect(datePickerFormatter.fromModel(date)).toEqual(datepickerFormat);
    expect(datePickerFormatter.toModel(datepickerFormat)).toEqual(date);
    expect(datePickerFormatter.fromModel(null)).toEqual(null);
    expect(datePickerFormatter.toModel(null)).toEqual(null);

  });



});
function patchPersonFormGroup(component: ManagerPersonComponent, mockPerson: Person) {
  component.fg.patchValue({person: mockPerson});
  component.fg.patchValue({person: {birthDate: new NgbStringAdapter().fromModel(component.fg.get('person').get('birthDate').value)}});
}

