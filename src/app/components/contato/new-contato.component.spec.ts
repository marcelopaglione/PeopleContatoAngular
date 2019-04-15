import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewContatoComponent } from './new-contato.component';
import { TitleComponent } from '../title/title.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AlertComponent } from '../alert/alert.component';
import { RouterModule, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { PaginationComponent } from '../pagination/pagination.component';
import { Observable } from 'rxjs';

describe('HomeComponent', () => {
  let component: NewContatoComponent;
  let fixture: ComponentFixture<NewContatoComponent>;
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
        NewContatoComponent,
        TitleComponent,
        AlertComponent,
        PaginationComponent
      ]
    }).compileComponents();
    router = TestBed.get(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewContatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove me', () => {
    const spy = spyOn(component, 'removeMe').and.callThrough();
    component.removeMe(1);
    expect(spy).toHaveBeenCalled();
  });
});
