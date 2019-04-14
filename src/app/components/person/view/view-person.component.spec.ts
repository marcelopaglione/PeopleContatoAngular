import {
  async,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { ViewPersonComponent } from './view-person.component';
import { TitleComponent } from '../../title/title.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { Contato, PersonContatoEntity } from 'src/app/Entities';
import { Observable } from 'rxjs';
import { doesNotThrow } from 'assert';

describe('ViewPersonComponent', () => {
  let component: ViewPersonComponent;
  let fixture: ComponentFixture<ViewPersonComponent>;
  let router: Router;
  let service: PeopleApiService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        RouterModule,
      ],
      declarations: [ViewPersonComponent, TitleComponent]
    }).compileComponents();
    router = TestBed.get(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPersonComponent);
    service = TestBed.get(PeopleApiService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to navigate to `/home`', (() => {
    const navigateSpy = spyOn(router, 'navigate');
    component.navigateBack();
    expect(navigateSpy).toHaveBeenCalledWith(['home']);
  }));

  it('should be able to navigate to `/person`', (() => {
    const navigateSpy = spyOn(router, 'navigate');
    component.person.id = 1;
    component.editPerson();
    expect(navigateSpy).toHaveBeenCalledWith(['person/1']);
  }));

  it('should be able to load contatos from database', (() => {
    const contato1: Contato = {
      id: 1,
      name: 'Contato Name',
      person: null
    };

    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(contato1);
        observer.complete();
      }, 10);
    });

    const spyloadContatos = spyOn(component, 'loadContatos').and.returnValue(observable);
    const spysetContatos = spyOn(component, 'setContatos').and.callThrough();

    component.loadContatos(1);
    component.setContatos([contato1]);
    expect(spyloadContatos).toHaveBeenCalled();
    expect(spysetContatos).toHaveBeenCalled();

    expect(component.contatos.length).toBeGreaterThan(0);
  }));

  it('should to load loadPersonAndItsContatos from the database', ((done) => {
    const expected = { body: {id: 124, name: 'Name', birthDate: '01/01/1900', rg: '125153'} };

    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next({body: expected});
        observer.complete();
      }, 10);
    });

    const spyloadContatos = spyOn(component, 'apiLoadPersonAndItsContatos').and.returnValue(observable);
    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(component, 'loadContatos').and.callFake(() => {done(); });

    component.idFromUrlParam = 124;
    component.ngOnInit();
    expect(spyloadContatos).toHaveBeenCalled();

  }));

  it('should to load loadContatos from the database', (() => {
    const expected = { body: {id: 124, name: 'Name', person: null} };

    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next({body: expected});
        observer.complete();
      }, 10);
    });

    const spyloadContatos = spyOn(component, 'apiContatoByPersonId').and.returnValue(observable);
    // spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(component, 'loadContatos').and.callThrough();

    component.loadContatos(142);
    expect(spyloadContatos).toHaveBeenCalled();

  }));
});
