import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerPersonComponent } from './manage-person.component';
import { TitleComponent } from '../title/title.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AlertComponent } from '../alert/alert.component';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('ManagerPersonComponent', () => {
  let component: ManagerPersonComponent;
  let fixture: ComponentFixture<ManagerPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        RouterTestingModule
      ],
      declarations: [
        ManagerPersonComponent,
        TitleComponent,
        AlertComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
