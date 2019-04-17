import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPersonComponent } from './details-person.component';
import { TitleComponent } from '../../shared/title/title.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { MockPeopleApiService } from 'src/app/services/MockPeopleApiService';

describe('DetailsPersonComponent', () => {
  let component: DetailsPersonComponent;
  let fixture: ComponentFixture<DetailsPersonComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, RouterModule],
      declarations: [DetailsPersonComponent, TitleComponent],
      providers: [{ provide: PeopleApiService, useClass: MockPeopleApiService }]
    }).compileComponents();
    router = TestBed.get(Router);
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
    component.ngOnInit();
    component.allData$.subscribe(data => {
      expect(data.contatos.length).toBe(1);
      expect(data.person.id).toEqual(1);
      data.contatos.map(c => {
        expect(c.id).toEqual(1);
      });
      done();
    });
  });
});
