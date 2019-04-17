import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { TitleComponent } from '../shared/title/title.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AlertComponent } from '../shared/alert/alert.component';
import { RouterModule, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { Person } from 'src/app/Entities';
import { MockPeopleApiService } from 'src/app/services/MockPeopleApiService';
import { PeopleApiService } from 'src/app/services/people-api.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;
  let service: MockPeopleApiService;

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
      ],
      providers: [{ provide: PeopleApiService, useClass: MockPeopleApiService }]
    }).compileComponents();
    router = TestBed.get(Router);
    service = TestBed.get(PeopleApiService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    jasmine.getEnv().addReporter({
      specStarted(result) {
        console.log(result.fullName);
      }
    });
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
    component.searchString = 'ABC';
    component.keyDownFunction({keyCode: 13});
    fixture.detectChanges();
    expect(component.page.number).toEqual(0);
    expect(component.page.content.length).toEqual(1);
  });

  it('should be able to search for person by empty input string after enter key enter', () => {
    component.searchString = '';
    component.keyDownFunction({keyCode: 13});
    fixture.detectChanges();
    expect(component.page.number).toEqual(0);
    expect(component.page.content.length).toEqual(1);
  });

  it('should receive feedback from the pagination component and update list view with empty search and user search', () => {
    component.searchString = 'ASC';
    component.searchString = '';
    const mockPage = component.page;
    mockPage.number = 18;
    component.reciverFeedbackFromPagination({page: mockPage});
    expect(component.page.number).toEqual(mockPage.number);
    expect(component.page.content.length).toEqual(1);
  });

  it('should remove person', () => {
    const mockPerson: Person = {id: 15, name: 'Person 15', birthDate: new Date(1500, 12, 31), rg: '1919191'};
    spyOn(window, 'confirm').and.returnValue(true);
    const spy = spyOn(component, 'loadPeoplePaginatedFromDatabase');
    component.removerPerson(mockPerson);
    fixture.detectChanges();
    // ngOnInit + delete Call == 2
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should not find person when remove a person', () => {
    const mockPerson: Person = {id: 0, name: 'Person 15', birthDate: new Date(1500, 12, 31), rg: '1919191'};
    spyOn(window, 'confirm').and.returnValue(true);
    const spy = spyOn(window, 'alert');
    component.removerPerson(mockPerson);
    fixture.detectChanges();
    // ngOnInit + delete Call == 2
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not remove person', () => {
    const mockPerson: Person = {id: 15, name: 'Person 15', birthDate: new Date(1500, 12, 31), rg: '1919191'};
    spyOn(window, 'confirm').and.returnValue(false);
    const spy = spyOn(component, 'loadPeoplePaginatedFromDatabase');
    component.removerPerson(mockPerson);
    fixture.detectChanges();
    // ngOnInit + no delete Call == 1
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
