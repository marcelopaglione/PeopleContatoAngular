import { TestBed, fakeAsync, inject, tick } from '@angular/core/testing';

import { PeopleApiService } from './people-api.service';
import { HttpClientModule } from '@angular/common/http';
import { Page, Person, Contato, PersonContatoEntity } from '../Entities';
import { Observable } from 'rxjs';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { MockPeopleApiService } from './MockPeopleApiService';

describe('PeopleApiService', () => {
  let service: PeopleApiService;
  const page = {
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
  const API = environment.API;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientModule, HttpClientTestingModule],
      providers: [{ provide: PeopleApiService, useClass: MockPeopleApiService }]
    })
  );

  beforeEach(() => {
    service = TestBed.get(PeopleApiService);
    jasmine.getEnv().addReporter({
      specStarted(result) {
        console.log(result.fullName);
      }
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


});
