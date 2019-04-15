import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { TitleComponent } from '../shared/title/title.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AlertComponent } from '../shared/alert/alert.component';
import { RouterModule, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { Observable } from 'rxjs';
import { Page } from 'src/app/Entities';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        RouterModule,
        RouterTestingModule
      ],
      declarations: [
        HomeComponent,
        TitleComponent,
        AlertComponent,
        PaginationComponent
      ]
    }).compileComponents();
    router = TestBed.get(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to edit person', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.editarPerson(1);
    expect(navigateSpy).toHaveBeenCalledWith(['person/1']);
  });

  it('should be able to view details of person', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.viewDetails(1);
    expect(navigateSpy).toHaveBeenCalledWith(['details/1']);
  });

  it('should be able to search for person by input string after enter key enter', () => {
    const spy = spyOn(component, 'searchFromInputUser').and.returnValue(true);
    spyOn(component, 'keyDownFunction').and.callThrough();
    component.keyDownFunction({ keyCode: 13 });
    expect(spy).toHaveBeenCalled();
  });

  it('should reset page number before search', () => {
    const spy = spyOn(component, 'search').and.returnValue(true);
    spyOn(component, 'searchFromInputUser').and.callThrough();
    component.page.number = 10;
    component.searchFromInputUser();
    expect(component.page.number).toBe(0);
    expect(spy).toHaveBeenCalled();
  });

  it('should perform a search', () => {
    const expected: Page = {
      content: [],
      first: true,
      last: false,
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 10,
      numberOfElements: 0,
      empty: true
    };
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next({ body: expected });
        observer.complete();
      }, 10);
    });

    const spy = spyOn(
      component,
      'apiLoadPeoplePaginatedFromDatabase'
    ).and.returnValue(observable);
    spyOn(component, 'search').and.callThrough();
    component.searchString = '';
    component.search();
    expect(spy).toHaveBeenCalled();
  });

  it('should perform a search with input valur from the user', () => {
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next({ body: component.page });
        observer.complete();
      }, 1000);
    });
    const spy = spyOn(
      component,
      'apiGetPersonByNameContaining'
    ).and.returnValue(observable);

    spyOn(component, 'search').and.callThrough();
    component.searchString = 'ABC';
    component.search();
    expect(spy).toHaveBeenCalled();
  });

  it('should receive feedback from the pagination component and update list view with empty search and user search', () => {
    component.searchString = 'ASC';
    const spy = spyOn(component, 'updateListViewAtPage').and.callThrough();
    spyOn(component, 'reciverFeedbackFromPagination').and.callThrough();
    spyOn(component, 'loadPeoplePaginatedFromDatabase').and.returnValue(false);

    component.reciverFeedbackFromPagination({
      event: 'changeMaxItemsPerPage',
      page: component.page
    });
    expect(spy).toHaveBeenCalled();

    component.searchString = '';
    component.reciverFeedbackFromPagination({
      event: 'changeMaxItemsPerPage',
      page: component.page
    });
    expect(spy).toHaveBeenCalled();
  });
});
