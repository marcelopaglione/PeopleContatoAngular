import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaginationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test navigation page', () => {
    component.page.number = 10;
    component.page.totalPages = 30;
    const page = component.page;
    spyOn(component, 'updateListViewAtPage').and.callThrough();
    component.nextPage();
    expect(component.page.number).toBe(11);
    component.prevPage();
    expect(component.page.number).toBe(10);
    component.firstPage();
    expect(component.page.number).toBe(0);
    component.lastPage();
    expect(component.page.number).toBe(29);
    component.searchString = 'A';
    component.gotoPage(1);
    expect(component.page.number).toBe(1);
    component.searchString = '';
    component.changeMaxItemsPerPage(10);
    expect(component.page.size).toBe(10);
  });

  it ('should update list of people when totalPages are less than the current selected page', () => {
    spyOn(component, 'updateListViewAtPage').and.callThrough();
    const page = component.page;
    page.totalPages = 10;
    component.gotoPage(15);
    expect(component.updateListViewAtPage).toHaveBeenCalled();
  });
});
