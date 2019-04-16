import { TestBed } from '@angular/core/testing';

import { ManagePersonService } from './manage-person.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Contato, Person } from 'src/app/Entities';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { MockPeopleApiService } from 'src/app/services/MockPeopleApiService';

describe('ManagePersonService', () => {
  let mockPerson: Person;
  let mockContato: Contato;
  let service: ManagePersonService;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientModule, HttpClientTestingModule],
      providers: [{ provide: PeopleApiService, useClass: MockPeopleApiService }]
    })
  );

  beforeEach(() => {
    service = TestBed.get(ManagePersonService);
    mockPerson = {id: null, name: 'Nova Pessoa Full Name', rg: '1597534682', birthDate: '31/01/2015'};
    mockContato = {id: 0, name: 'Seu Aparecido', person: mockPerson};
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should remove contato from database and return 200', (done) => {
    mockContato.id = 1;
    spyOn(service as any, 'removeContatoFromDatabase').and.callThrough();

    service.removeContatoFromDatabase(mockContato)
      .subscribe(data => {
        expect(service.response.status).toEqual('success');
        console.log(data);
        done();
    });
  });

  it('should remove contato from database and return 404', (done) => {
    mockContato.id = null;
    spyOn(service as any, 'removeContatoFromDatabase').and.callThrough();

    service.removeContatoFromDatabase(mockContato)
      .subscribe(data => {
        expect(service.response.status).toEqual('warning');
        console.log(data);
        done();
    });
  });

});
