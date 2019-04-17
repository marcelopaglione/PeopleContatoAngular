import { TestBed, fakeAsync, inject, tick } from '@angular/core/testing';

import { PeopleApiService } from './people-api.service';
import { HttpClientModule } from '@angular/common/http';
import { Person, Contato, PersonContatoEntity } from '../Entities';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('PeopleApiService', () => {
  let service: PeopleApiService;
  const page = {
    content: [], first: true, last: false, totalElements: 0,
    totalPages: 0, number: 0, size: 10, numberOfElements: 0, empty: true
  };
  const API = environment.API;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientModule, HttpClientTestingModule]
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

  it('should call getPeople from the api http service', fakeAsync(
    inject([PeopleApiService, HttpTestingController], (api: PeopleApiService, backend: HttpTestingController) => {

        const responseObject = { success: true, message: 'success' };
        let response = null;
        api.getPeople(page) .subscribe((receivedResponse: any) => response = receivedResponse );
        const requestWrapper = backend.expectOne({
          url: `${API}people?size=${page.size}&page=${page.number}`
        });
        requestWrapper.flush(responseObject);
        tick();
        expect(requestWrapper.request.method).toEqual('GET');
        expect(response.body).toEqual(responseObject);
        expect(response.status).toBe(200);
      }
    )
  ));

  it('should call getContatos from the api http service', fakeAsync(
    inject([PeopleApiService, HttpTestingController], (api: PeopleApiService, backend: HttpTestingController) => {

        const responseObject = { success: true, message: 'success' };
        let response = null;
        api.getContatos(page).subscribe((receivedResponse: any) => response = receivedResponse );
        const requestWrapper = backend.expectOne({
          url: `${API}contatos?size=${page.size}&page=${page.number}`
        });
        requestWrapper.flush(responseObject);
        tick();
        expect(requestWrapper.request.method).toEqual('GET');
        expect(response.body).toEqual(responseObject);
        expect(response.status).toBe(200);
      }
    )
  ));

  it('should call getPersonById from the api http service', fakeAsync(
    inject([PeopleApiService, HttpTestingController], (api: PeopleApiService, backend: HttpTestingController) => {
        const id = 1;
        const responseObject = { success: true, message: 'success' };
        let response = null;
        api.getPersonById(1).subscribe((receivedResponse: any) => response = receivedResponse );
        const requestWrapper = backend.expectOne({
          url: `${API}people/${id}`
        });
        requestWrapper.flush(responseObject);
        tick();
        expect(requestWrapper.request.method).toEqual('GET');
        expect(response.body).toEqual(responseObject);
        expect(response.status).toBe(200);
      }
    )
  ));

  it('should call getContatoById from the api http service', fakeAsync(
    inject([PeopleApiService, HttpTestingController], (api: PeopleApiService, backend: HttpTestingController) => {
        const id = 1;
        const responseObject = { success: true, message: 'success' };
        let response = null;
        api.getContatoById(1).subscribe((receivedResponse: any) => response = receivedResponse );
        const requestWrapper = backend.expectOne({
          url: `${API}contatos/${id}`
        });
        requestWrapper.flush(responseObject);
        tick();
        expect(requestWrapper.request.method).toEqual('GET');
        expect(response.body).toEqual(responseObject);
        expect(response.status).toBe(200);
      }
    )
  ));

  it('should call getPersonByNameContaining from the api http service', fakeAsync(
    inject([PeopleApiService, HttpTestingController], (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const name = 'searchString';
        api.getPersonByNameContaining(name, page).subscribe((receivedResponse: any) => response = receivedResponse );
        const requestWrapper = backend.expectOne({ url:
          `${API}people/findByName/${name}?size=${page.size}&page=${page.number}`
        });
        requestWrapper.flush(responseObject);
        tick();
        expect(requestWrapper.request.method).toEqual('GET');
        expect(response.body).toEqual(responseObject);
        expect(response.status).toBe(200);
      }
    )
  ));

  it('should call getContatoByNameContaining from the api http service', fakeAsync(
    inject([PeopleApiService, HttpTestingController], (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const name = 'searchString';
        api.getContatoByNameContaining(name).subscribe( (receivedResponse: any) => { response = receivedResponse; });
        const requestWrapper = backend.expectOne({ url:
          `${API}contatos/findByName/${name}`
        });
        requestWrapper.flush(responseObject);
        tick();
        expect(requestWrapper.request.method).toEqual('GET');
        expect(response.body).toEqual(responseObject);
        expect(response.status).toBe(200);
      }
    )
  ));

  it('should call getContatoByPersonId from the api http service', fakeAsync(
    inject([PeopleApiService, HttpTestingController], (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const id = 12;
        api.getContatoByPersonId(id).subscribe( (receivedResponse: any) => response = receivedResponse );
        const requestWrapper = backend.expectOne({ url:
          `${API}contatos/findByPersonId/${id}`
        });
        requestWrapper.flush(responseObject);
        tick();
        expect(requestWrapper.request.method).toEqual('GET');
        expect(response.body).toEqual(responseObject);
        expect(response.status).toBe(200);
      }
    )
  ));

  it('should call savePerson with POST from the api http service', fakeAsync(
    inject([PeopleApiService, HttpTestingController], (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const person: Person = {id: 0, name: '', birthDate: null, rg: '' };
        api.savePerson(person).subscribe((receivedResponse: any) => response = receivedResponse );
        const requestWrapper = backend.expectOne({ url:
          `${API}people/`
        });
        requestWrapper.flush(responseObject);
        tick();
        expect(requestWrapper.request.method).toEqual('POST');
        expect(response.body).toEqual(responseObject);
        expect(response.status).toBe(200);
      }
    )
  ));

  it('should call savePerson with PUT from the api http service', fakeAsync(
    inject([PeopleApiService, HttpTestingController], (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const person: Person = {id: 12, name: '', birthDate: null, rg: '' };
        api.savePerson(person).subscribe((receivedResponse: any) => response = receivedResponse );
        const requestWrapper = backend.expectOne({ url:
          `${API}people/`
        });
        requestWrapper.flush(responseObject);
        tick();
        expect(requestWrapper.request.method).toEqual('PUT');
        expect(response.body).toEqual(responseObject);
        expect(response.status).toBe(200);
      }
    )
  ));

  it('should call saveContato with POST from the api http service', fakeAsync(
    inject([PeopleApiService, HttpTestingController], (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const contato: Contato = {id: 0, name: '', person: null };
        api.saveContato(contato).subscribe((receivedResponse: any) => response = receivedResponse );
        const requestWrapper = backend.expectOne({ url:
          `${API}contatos/`
        });
        requestWrapper.flush(responseObject);
        tick();
        expect(requestWrapper.request.method).toEqual('POST');
        expect(response.body).toEqual(responseObject);
        expect(response.status).toBe(200);
      }
    )
  ));

  it('should call saveContato with PUT from the api http service', fakeAsync(
    inject([PeopleApiService, HttpTestingController], (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const contato: Contato = {id: 15, name: '', person: null };
        api.saveContato(contato).subscribe((receivedResponse: any) => response = receivedResponse );
        const requestWrapper = backend.expectOne({ url:
          `${API}contatos/`
        });
        requestWrapper.flush(responseObject);
        tick();
        expect(requestWrapper.request.method).toEqual('PUT');
        expect(response.body).toEqual(responseObject);
        expect(response.status).toBe(200);
      }
    )
  ));

  it('should call savePersonAndContato with POST from the api http service', fakeAsync(
    inject([PeopleApiService, HttpTestingController], (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const entity: PersonContatoEntity = {person : {id: 0, name: '', birthDate: null, rg: '' }, contatos: []};
        api.savePersonAndContato(entity).subscribe((receivedResponse: any) => response = receivedResponse );
        const requestWrapper = backend.expectOne({ url:
          `${API}contatos/savePersonAndContatos/`
        });
        requestWrapper.flush(responseObject);
        tick();
        expect(requestWrapper.request.method).toEqual('POST');
        expect(response.body).toEqual(responseObject);
        expect(response.status).toBe(200);
      }
    )
  ));

  it('should call savePersonAndContato with PUT from the api http service', fakeAsync(
    inject([PeopleApiService, HttpTestingController], (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const entity: PersonContatoEntity = {person : {id: 15, name: '', birthDate: null, rg: '' }, contatos: []};
        api.savePersonAndContato(entity).subscribe((receivedResponse: any) => response = receivedResponse );
        const requestWrapper = backend.expectOne({ url:
          `${API}contatos/updatePersonAndContatos/`
        });
        requestWrapper.flush(responseObject);
        tick();
        expect(requestWrapper.request.method).toEqual('PUT');
        expect(response.body).toEqual(responseObject);
        expect(response.status).toBe(200);
      }
    )
  ));

  it('should call deletePersonById from the api http service', fakeAsync(
    inject([PeopleApiService, HttpTestingController], (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const id = 12315;
        api.deletePersonById(id).subscribe((receivedResponse: any) => response = receivedResponse );
        const requestWrapper = backend.expectOne({ url:
          `${API}people/${id}`
        });
        requestWrapper.flush(responseObject);
        tick();
        expect(requestWrapper.request.method).toEqual('DELETE');
        expect(response.body).toEqual(responseObject);
        expect(response.status).toBe(200);
      }
    )
  ));

  it('should call deleteContatoById from the api http service', fakeAsync(
    inject([PeopleApiService, HttpTestingController], (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const id = 12315;
        api.deleteContatoById(id).subscribe((receivedResponse: any) => response = receivedResponse);
        const requestWrapper = backend.expectOne({ url:
          `${API}contatos/${id}`
        });
        requestWrapper.flush(responseObject);
        tick();
        expect(requestWrapper.request.method).toEqual('DELETE');
        expect(response.body).toEqual(responseObject);
        expect(response.status).toBe(200);
      }
    )
  ));

});
