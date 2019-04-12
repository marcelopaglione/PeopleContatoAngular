import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render new person link button', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#newPerson').textContent).toContain('New Person');
  });

  it('should render home link button', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#home').textContent).toContain('Home');
  });
});
