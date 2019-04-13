import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  getTestBed
} from '@angular/core/testing';

import { ViewPersonComponent } from './view-person.component';
import { TitleComponent } from '../../title/title.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { of as observableOf} from 'rxjs';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { Contato } from 'src/app/Entities';

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
        RouterModule
      ],
      declarations: [ViewPersonComponent, TitleComponent]
    }).compileComponents();
    router = TestBed.get(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPersonComponent);
    service = TestBed.get(PeopleApiService);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

    // spyOn(component, 'loadContatos').and.callThrough();
    // .and.returnValue([contato1])
    const spyloadContatos = spyOn(component, 'loadContatos');
    const spysetContatos = spyOn(component, 'setContatos').and.callThrough();
    component.loadContatos(1);
    component.setContatos([contato1]);
    expect(spyloadContatos).toHaveBeenCalled();
    expect(spysetContatos).toHaveBeenCalled();

    expect(component.contatos.length).toBeGreaterThan(0);
  }));


});
