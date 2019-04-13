import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerPersonComponent } from './manage-person.component';
import { TitleComponent } from '../../title/title.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AlertComponent } from '../../alert/alert.component';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Person, Contato } from 'src/app/Entities';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { Observable } from 'rxjs';

describe('ManagerPersonComponent', () => {
  let component: ManagerPersonComponent;
  let service: PeopleApiService;
  let fixture: ComponentFixture<ManagerPersonComponent>;
  let inputElementName: HTMLInputElement;
  let inputElementRG: HTMLInputElement;
  let inputElementBirthDate: HTMLInputElement;
  let inputElementButtonSave: HTMLInputElement;

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
        AlertComponent
      ]
    })
    .compileComponents();
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

  it('should validate form submition', () => {/*
    const person = {
      id: 0,
      name: 'should persist a person',
      birthDate: '10/10/2010',
      rg: '1010101050'
    };
    component.ngOnInit();
    component.fg.patchValue(person);
    spyOn(component, 'isValidFormToSubmit');
    spyOn(component, 'isBirthDateInvalid');

    component.isValidFormToSubmit();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.isValidFormToSubmit).toHaveBeenCalled();
      expect(component.isBirthDateInvalid).toHaveBeenCalled();

      console.log('status:' + component.response.status);
      console.log('message:' + component.response.message);

      console.log('savePerson was called');
      // expect(component.fg.valid).toBeTruthy();
      done();
    });*/

    // const compiled = fixture.debugElement.nativeElement;
    // expect(compiled.querySelector('#novoJogo').textContent).toContain('Novo Jogo');
  });

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

  it('should load contatos from database', () => {
   /* component.idFromUrlParam = 1;
    const contato: Contato[] = [{ name: 'Contato Name', id: 1, person: null }];
    spyOn(component, 'loadContatos').and.callThrough();
    spyOn(service, 'getContatoByPersonId').and.returnValue(Promise.resolve(contato));

    component.loadContatos();


    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.loadContatos).toHaveBeenCalled();
      done();
    });*/
  });

});
