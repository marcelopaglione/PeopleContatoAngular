import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPersonComponent } from './new-person.component';
import { TitleComponent } from '../title/title.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AlertComponent } from '../alert/alert.component';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('NewPersonComponent', () => {
  let component: NewPersonComponent;
  let fixture: ComponentFixture<NewPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        RouterTestingModule
      ],
      declarations: [
        NewPersonComponent,
        TitleComponent,
        AlertComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
