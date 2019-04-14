import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerPersonComponent } from './manage-person.component';
import { TitleComponent } from '../../title/title.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AlertComponent } from '../../alert/alert.component';
import { RouterModule, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Person, Contato } from 'src/app/Entities';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { NewContatoComponent } from '../../contato/new-contato.component';
import { Observable } from 'rxjs';

describe('ManagerPersonComponent', () => {
  let component: ManagerPersonComponent;
  let service: PeopleApiService;
  let fixture: ComponentFixture<ManagerPersonComponent>;
  let inputElementName: HTMLInputElement;
  let inputElementRG: HTMLInputElement;
  let inputElementBirthDate: HTMLInputElement;
  let inputElementButtonSave: HTMLInputElement;
  let router: Router;

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
      ]
    })
    .compileComponents();
    router = TestBed.get(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.get(PeopleApiService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hit on create a person and the formGroup should be valid', (done) => {
    inputElementName = fixture.nativeElement.querySelector('input[id=name]');
    inputElementRG = fixture.nativeElement.querySelector('input[id=rg]');
    inputElementBirthDate = fixture.nativeElement.querySelector('input[id=birthDate]');
    inputElementButtonSave = fixture.nativeElement.querySelector('button[id=save]');

    const person: Person = {
      id: 0,
      name: 'PersoName',
      birthDate: new Date('10/10/2010'),
      rg: '1010101050'
    };

    sendInput(person).then(() => {
      fixture.detectChanges();
      spyOn(component, 'savePerson');
      const button = fixture.debugElement.nativeElement.querySelector('#save');
      button.click();
      fixture.whenStable().then(() => {
        expect(component.savePerson).toHaveBeenCalled();
        expect(component.fg.valid).toBeTruthy();
        done();
      });
    });

  });

  function sendInput(person: Person) {
    inputElementName.value = person.name;
    inputElementRG.value = person.rg;
    inputElementBirthDate.value = person.birthDate.toString();

    inputElementName.dispatchEvent(new Event('input'));
    inputElementRG.dispatchEvent(new Event('input'));
    inputElementBirthDate.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    return fixture.whenStable();
  }

  it('should validate birthDate', () => {
    let date = '31/12/2050';
    let dateValidateResult = component.validateDate(date);
    expect(dateValidateResult).toBe(true);

    date = '31/31/2150';
    dateValidateResult = component.validateDate(date);
    expect(dateValidateResult).toBe(false);

    date = '01/01/2150';
    dateValidateResult = component.validateDate(date);
    expect(dateValidateResult).toBe(true);

    component.fg.patchValue({birthDate: date});
    let birthDateResultIsInvalid = component.isBirthDateInvalid();
    expect(birthDateResultIsInvalid).toBe(false);

    date = '2050/12/2050';
    component.fg.patchValue({birthDate: date});
    birthDateResultIsInvalid = component.isBirthDateInvalid();
    expect(birthDateResultIsInvalid).toBe(true);

    date = '31/01/2050';
    component.fg.patchValue({birthDate: date});
    component.formatDateFromUserInput();
    expect(component.fg.value.birthDate.toString()).toContain('Mon Jan 31 2050');

    date = component.formatDate('2018-04-25T14:05:15.953Z');
    expect(date).toBe('25/04/2018');


  });

  it('set app title to Editar Pessoa and Cadastrar Nova Pessoa', () => {
    component.fg.patchValue({id: null});
    component.setApplicationTitle();
    fixture.detectChanges();
    expect(component.title).toBe('Cadastrar Nova Pessoa');
    component.fg.patchValue({id: 1});
    component.setApplicationTitle();
    fixture.detectChanges();
    expect(component.title).toBe('Editar Pessoa');
  });


  it('should be able to navigate to `/home`', (() => {
    const navigateSpy = spyOn(router, 'navigate');
    component.navigateBack();
    expect(navigateSpy).toHaveBeenCalledWith(['home']);
  }));


  it('should validate form before submit return true', (() => {

    component.fg.patchValue({id: null});
    const date = '31/01/2050';
    component.fg.patchValue({birthDate: date});
    component.fg.patchValue({name: 'NameName'});
    component.fg.patchValue({rg: '050505050'});

    const spyisValidFormToSubmit = spyOn(component, 'isValidFormToSubmit').and.callThrough();
    const spyisBirthDateInvalid = spyOn(component, 'isBirthDateInvalid').and.callThrough();
    const spyisContatosInvalid = spyOn(component, 'isContatosInvalid').and.callThrough();

    const response = component.isValidFormToSubmit();

    expect(spyisBirthDateInvalid).toHaveBeenCalled();
    expect(spyisContatosInvalid).toHaveBeenCalled();
    expect(spyisValidFormToSubmit).toHaveBeenCalled();

    expect(response).toBe(true);

  }));


  it('should validate form before submit return false', (() => {

    component.fg.patchValue({id: null});
    component.fg.patchValue({name: 'NameName'});

    const spyisValidFormToSubmit = spyOn(component, 'isValidFormToSubmit').and.callThrough();
    const spyisBirthDateInvalid = spyOn(component, 'isBirthDateInvalid').and.callThrough();
    const spyisContatosInvalid = spyOn(component, 'isContatosInvalid').and.callThrough();

    const response = component.isValidFormToSubmit();

    expect(spyisBirthDateInvalid).toHaveBeenCalledTimes(0);
    expect(spyisContatosInvalid).toHaveBeenCalledTimes(0);
    expect(spyisValidFormToSubmit).toHaveBeenCalled();

    expect(response).toBe(false);
  }));

  it('should create a valid entity to persist', (() => {
    const contato: Contato = {
      id: 1,
      name: 'contato',
      person: null
    };
    component.fg.patchValue({id: null});
    const date = '31/01/2050';
    component.fg.patchValue({birthDate: date});
    component.fg.patchValue({name: 'NameName'});
    component.fg.patchValue({rg: '050505050'});
    const person = component.fg.value;

    spyOn(component, 'getContatos').and.returnValue([contato]);

    const entityToPersist = component.createEntityToPersist();
    expect(entityToPersist.person).toEqual(person);
    expect(entityToPersist.contatos).toEqual([contato]);

  }));


  it('should create return a valid list of contatos', (() => {
    component.fg.patchValue({id: null});
    const date = '31/01/2050';
    component.fg.patchValue({birthDate: date});
    component.fg.patchValue({name: 'NameName'});
    component.fg.patchValue({rg: '050505050'});
    const person = component.fg.value;
    const objectReference = {
      instance: {fg: {value: {id: null, name: '', person: {id: null, name: '', birthDate: null, rg: ''}}}}
    };
    component.componentsReferences.push(objectReference);

    const contatosList = component.getContatos();
    expect(contatosList.length).toBeDefined();

  }));

  it('should isContatosInvalid return true', (() => {
    component.fg.patchValue({id: null});
    const date = '31/01/2050';
    component.fg.patchValue({birthDate: date});
    component.fg.patchValue({name: ''});
    component.fg.patchValue({rg: '050505050'});
    const person = component.fg.value;
    const objectReference = {
      instance: {fg: {value: {id: null, name: '', person: {id: null, name: '', birthDate: null, rg: ''}}}}
    };
    component.componentsReferences.push(objectReference);

    const isContatosInvalidReponse = component.isContatosInvalid();
    expect(isContatosInvalidReponse).toBe(true);

  }));


  it('should load a person from the database', (() => {

    const expected = {
      body: { id: '1', name: 'ABS', birthDate: '10/12/2015', rg: '912931294' },
      status: 200,
    };
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 200);
    });
    spyOn(component, 'apiLoadPersonFromDatabase').and.returnValue(observable);
    spyOn(component, 'loadPerson').and.callThrough();
    spyOn(component, 'loadContatos').and.returnValue(false);
    component.idFromUrlParam = 1;
    component.loadPerson();

  }));

});
