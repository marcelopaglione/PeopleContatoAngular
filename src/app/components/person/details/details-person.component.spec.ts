import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPersonComponent } from './details-person.component';
import { TitleComponent } from '../../shared/title/title.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { Contato, PersonContatoEntity, Person } from 'src/app/Entities';
import { Observable, of } from 'rxjs';
import { doesNotThrow } from 'assert';
import { pipe } from '@angular/core/src/render3';
import { map } from 'rxjs/operators';

describe('DetailsPersonComponent', () => {
  let component: DetailsPersonComponent;
  let fixture: ComponentFixture<DetailsPersonComponent>;
  let router: Router;
  let service: PeopleApiService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, RouterModule],
      declarations: [DetailsPersonComponent, TitleComponent],
      providers: [PeopleApiService]
    }).compileComponents();
    router = TestBed.get(Router);

    service = TestBed.get(PeopleApiService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsPersonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to navigate to `/home`', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.navigateBack();
    expect(navigateSpy).toHaveBeenCalledWith(['home']);
  });

  it('should be able to navigate to `/person`', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.idFromUrlParam = 1;
    component.editPerson();
    expect(navigateSpy).toHaveBeenCalledWith(['person/1']);
  });

  it('should be able to load contatos from database', done => {
    console.log('start');
    const mockContato: Contato = {
      id: 1,
      name: 'Contato Name',
      person: null
    };
    spyOn(service, 'getContatoByPersonId').and.callFake(() => {
      return of({ body: [mockContato] });
    });

    const mockPerson: Person = {
      id: 1,
      name: 'Person name',
      rg: '101010',
      birthDate: null
    };
    spyOn(service, 'getPersonById').and.callFake(() => {
      return of({ body: mockPerson });
    });

    component.ngOnInit();
    component.allData$.subscribe(data => {
      console.log(data);
      expect(data.contatos.length).toBe(1);
      expect(data.person).toEqual(mockPerson);
      data.contatos.map(c => {
        expect(c).toEqual(mockContato);
      });
      console.log('end');
      done();
    });
  });
});
