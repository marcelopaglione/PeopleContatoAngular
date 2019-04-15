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
      imports: [HttpClientModule, HttpClientModule, HttpClientTestingModule]
    })
  );

  beforeEach(() => {
    service = TestBed.get(PeopleApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getPeople from the api http service', fakeAsync(
    inject(
      [PeopleApiService, HttpTestingController],
      (api: PeopleApiService, backend: HttpTestingController) => {
        const url = `${API}people?size=${page.size}&page=${page.number}`;
        const responseObject = { success: true, message: 'success' };
        let response = null;
        api.getPeople(page).subscribe(
          (receivedResponse: any) => {
            response = receivedResponse;
          },
          (error: any) => {}
        );
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
    inject(
      [PeopleApiService, HttpTestingController],
      (api: PeopleApiService, backend: HttpTestingController) => {
        const url = `${API}contatos?size=${page.size}&page=${page.number}`;
        const responseObject = { success: true, message: 'success' };
        let response = null;
        api.getContatos(page).subscribe(
          (receivedResponse: any) => {
            response = receivedResponse;
          },
          (error: any) => {}
        );
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
    inject(
      [PeopleApiService, HttpTestingController],
      (api: PeopleApiService, backend: HttpTestingController) => {
        const id = 1;
        const url = `${API}people/${id}`;
        const responseObject = { success: true, message: 'success' };
        let response = null;
        api.getPersonById(1).subscribe(
          (receivedResponse: any) => {
            response = receivedResponse;
          },
          (error: any) => {}
        );
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
    inject(
      [PeopleApiService, HttpTestingController],
      (api: PeopleApiService, backend: HttpTestingController) => {
        const id = 1;
        const responseObject = { success: true, message: 'success' };
        let response = null;
        api.getContatoById(1).subscribe(
          (receivedResponse: any) => {
            response = receivedResponse;
          },
          (error: any) => {}
        );
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
    inject(
      [PeopleApiService, HttpTestingController],
      (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const name = 'searchString';
        api.getPersonByNameContaining(name, page).subscribe(
          (receivedResponse: any) => {
            response = receivedResponse;
          },
          (error: any) => {}
        );
        const requestWrapper = backend.expectOne({
          url: `${API}people/findByName/${name}?size=${page.size}&page=${
            page.number
          }`
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
    inject(
      [PeopleApiService, HttpTestingController],
      (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const name = 'searchString';
        api.getContatoByNameContaining(name).subscribe(
          (receivedResponse: any) => {
            response = receivedResponse;
          },
          (error: any) => {}
        );
        const requestWrapper = backend.expectOne({
          url: `${API}contatos/findByName/${name}`
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
    inject(
      [PeopleApiService, HttpTestingController],
      (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const id = 12;
        api.getContatoByPersonId(id).subscribe(
          (receivedResponse: any) => {
            response = receivedResponse;
          },
          (error: any) => {}
        );
        const requestWrapper = backend.expectOne({
          url: `${API}contatos/findByPersonId/${id}`
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
    inject(
      [PeopleApiService, HttpTestingController],
      (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const person: Person = { id: 0, name: '', birthDate: null, rg: '' };
        api.savePerson(person).subscribe(
          (receivedResponse: any) => {
            response = receivedResponse;
          },
          (error: any) => {}
        );
        const requestWrapper = backend.expectOne({ url: `${API}people/` });
        requestWrapper.flush(responseObject);
        tick();
        expect(requestWrapper.request.method).toEqual('POST');
        expect(response.body).toEqual(responseObject);
        expect(response.status).toBe(200);
      }
    )
  ));

  it('should call savePerson with PUT from the api http service', fakeAsync(
    inject(
      [PeopleApiService, HttpTestingController],
      (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const person: Person = { id: 12, name: '', birthDate: null, rg: '' };
        api.savePerson(person).subscribe(
          (receivedResponse: any) => {
            response = receivedResponse;
          },
          (error: any) => {}
        );
        const requestWrapper = backend.expectOne({ url: `${API}people/` });
        requestWrapper.flush(responseObject);
        tick();
        expect(requestWrapper.request.method).toEqual('PUT');
        expect(response.body).toEqual(responseObject);
        expect(response.status).toBe(200);
      }
    )
  ));

  it('should call saveContato with POST from the api http service', fakeAsync(
    inject(
      [PeopleApiService, HttpTestingController],
      (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const contato: Contato = { id: 0, name: '', person: null };
        api.saveContato(contato).subscribe(
          (receivedResponse: any) => {
            response = receivedResponse;
          },
          (error: any) => {}
        );
        const requestWrapper = backend.expectOne({ url: `${API}contatos/` });
        requestWrapper.flush(responseObject);
        tick();
        expect(requestWrapper.request.method).toEqual('POST');
        expect(response.body).toEqual(responseObject);
        expect(response.status).toBe(200);
      }
    )
  ));

  it('should call saveContato with PUT from the api http service', fakeAsync(
    inject(
      [PeopleApiService, HttpTestingController],
      (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const contato: Contato = { id: 15, name: '', person: null };
        api.saveContato(contato).subscribe(
          (receivedResponse: any) => {
            response = receivedResponse;
          },
          (error: any) => {}
        );
        const requestWrapper = backend.expectOne({ url: `${API}contatos/` });
        requestWrapper.flush(responseObject);
        tick();
        expect(requestWrapper.request.method).toEqual('PUT');
        expect(response.body).toEqual(responseObject);
        expect(response.status).toBe(200);
      }
    )
  ));

  it('should call savePersonAndContato with POST from the api http service', fakeAsync(
    inject(
      [PeopleApiService, HttpTestingController],
      (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const entity: PersonContatoEntity = {
          person: { id: 0, name: '', birthDate: null, rg: '' },
          contatos: []
        };
        api.savePersonAndContato(entity).subscribe(
          (receivedResponse: any) => {
            response = receivedResponse;
          },
          (error: any) => {}
        );
        const requestWrapper = backend.expectOne({
          url: `${API}contatos/savePersonAndContatos/`
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
    inject(
      [PeopleApiService, HttpTestingController],
      (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const entity: PersonContatoEntity = {
          person: { id: 15, name: '', birthDate: null, rg: '' },
          contatos: []
        };
        api.savePersonAndContato(entity).subscribe(
          (receivedResponse: any) => {
            response = receivedResponse;
          },
          (error: any) => {}
        );
        const requestWrapper = backend.expectOne({
          url: `${API}contatos/updatePersonAndContatos/`
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
    inject(
      [PeopleApiService, HttpTestingController],
      (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const id = 12315;
        api.deletePersonById(id).subscribe(
          (receivedResponse: any) => {
            response = receivedResponse;
          },
          (error: any) => {}
        );
        const requestWrapper = backend.expectOne({ url: `${API}people/${id}` });
        requestWrapper.flush(responseObject);
        tick();
        expect(requestWrapper.request.method).toEqual('DELETE');
        expect(response.body).toEqual(responseObject);
        expect(response.status).toBe(200);
      }
    )
  ));

  it('should call deleteContatoById from the api http service', fakeAsync(
    inject(
      [PeopleApiService, HttpTestingController],
      (api: PeopleApiService, backend: HttpTestingController) => {
        const responseObject = { success: true, message: 'success' };
        let response = null;
        const id = 12315;
        api.deleteContatoById(id).subscribe(
          (receivedResponse: any) => {
            response = receivedResponse;
          },
          (error: any) => {}
        );
        const requestWrapper = backend.expectOne({
          url: `${API}contatos/${id}`
        });
        requestWrapper.flush(responseObject);
        tick();
        expect(requestWrapper.request.method).toEqual('DELETE');
        expect(response.body).toEqual(responseObject);
        expect(response.status).toBe(200);
      }
    )
  ));

  it('should get a paginated list of people', done => {
    const expected = { body: { size: 5, number: 2 }, status: 200 };
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 10);
    });
    spyOn(service, 'getPeople').and.returnValue(observable);
    service.getPeople(page).subscribe(data => {
      expect(data.status).toBe(200);
      expect(data.body.size).toBe(5);
      expect(data.body.number).toBe(2);
      done();
    });
  });

  it('should get a ist of contatos', done => {
    const expected = { status: 200 };
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 10);
    });
    spyOn(service, 'getContatos').and.returnValue(observable);
    service.getContatos(page).subscribe(data => {
      expect(data.status).toBe(200);
      done();
    });
  });

  it('should get a paginated list of contatos by personId', done => {
    const expected = { status: 200 };
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 10);
    });
    spyOn(service, 'getContatoByPersonId').and.returnValue(observable);
    service.getContatoByPersonId(1).subscribe(data => {
      expect(data.status).toBe(200);
      done();
    });
  });

  it('should get a person by id', done => {
    const expected = { body: { id: 1 }, status: 200 };
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 10);
    });
    spyOn(service, 'getPersonById').and.returnValue(observable);
    service.getPersonById(1).subscribe(data => {
      expect(data.status).toBe(200);
      expect(data.body.id).toBe(1);
      done();
    });
  });

  it('should get a contato by id', done => {
    const expected = { body: { id: 51 }, status: 200 };
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 10);
    });
    spyOn(service, 'getContatoById').and.returnValue(observable);
    service.getContatoById(51).subscribe(data => {
      expect(data.status).toBe(200);
      expect(data.body.id).toBe(51);
      done();
    });
  });

  it('should get a person by name containing string', done => {
    const nameToSearch = 'NameToSearchValue';
    const expected = {
      body: { content: [] },
      status: 200
    };
    expected.body.content.push({ name: nameToSearch });
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 10);
    });
    spyOn(service, 'getPersonByNameContaining').and.returnValue(observable);
    service.getPersonByNameContaining(nameToSearch, page).subscribe(data => {
      expect(data.status).toBe(200);
      data.body.content.map(person => {
        expect(person.name).toContain(nameToSearch);
      });
      done();
    });
  });

  it('should get a contato by name containing string', done => {
    const nameToSearch = 'NameToSearch';
    const expected = { body: [], status: 200 };
    expected.body.push({ name: nameToSearch });
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 10);
    });

    spyOn(service, 'getContatoByNameContaining').and.returnValue(observable);
    service.getContatoByNameContaining(nameToSearch).subscribe(data => {
      expect(data.status).toBe(200);
      data.body.map(contato => {
        expect(contato.name).toContain(nameToSearch);
      });
      done();
    });
  });

  it('should create and persist a person', done => {
    const person: Person = {
      name: 'Beatiful Name',
      rg: '10101010101',
      birthDate: new Date(),
      id: 1
    };
    const expected = { body: person, status: 201 };
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 10);
    });
    spyOn(service, 'savePerson').and.returnValue(observable);

    service.savePerson(person).subscribe(data => {
      expect(data.status).toBe(201);
      expect(data.body.name).toBe(person.name);
      expect(data.body.rg).toBe(person.rg);
      expect(new Date(data.body.birthDate)).toEqual(person.birthDate);
      expect(data.body.id).toBeGreaterThan(0);
      done();
    });
  });

  it('should create and persist a contato', done => {
    const relatedPerson: Person = {
      name: 'Beatiful Person Name',
      rg: '10101010101',
      birthDate: new Date(),
      id: 1
    };
    const contato: Contato = {
      name: 'Beatiful Contato Name',
      id: 1,
      person: relatedPerson
    };
    const expected = { body: contato, status: 201 };
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 10);
    });
    spyOn(service, 'saveContato').and.returnValue(observable);

    service.saveContato(contato).subscribe(data => {
      expect(data.status).toBe(201);
      expect(data.body.name).toBe(contato.name);
      expect(data.body.id).toBeGreaterThan(0);
      done();
    });
  });

  it('should create and persist one person and his 3 contatos', done => {
    const relatedPerson: Person = {
      name: 'Person Name 1',
      rg: '10101010101',
      birthDate: new Date(),
      id: 0
    };
    const contato1: Contato = {
      name: 'Contact 1',
      id: 0,
      person: relatedPerson
    };
    const contato2: Contato = {
      name: 'Contact 2',
      id: 0,
      person: relatedPerson
    };
    const contato3: Contato = {
      name: 'Contatc 3',
      id: 0,
      person: relatedPerson
    };
    const saveEntity: PersonContatoEntity = {
      person: relatedPerson,
      contatos: [contato1, contato2, contato3]
    };
    const expected = { body: saveEntity, status: 200 };
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 10);
    });
    spyOn(service, 'savePersonAndContato').and.returnValue(observable);

    service.savePersonAndContato(saveEntity).subscribe(data => {
      expect(data.status).toBe(200);
      done();
    });
  });

  it('should to update a person', done => {
    const person: Person = {
      name: 'Beatiful Name',
      rg: '10101010101',
      birthDate: new Date(),
      id: 1
    };
    const expected = { body: person, status: 200 };
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);

        observer.complete();
      }, 10);
    });
    spyOn(service, 'savePerson').and.returnValue(observable);
    service.savePerson(person).subscribe(updatedPerson => {
      expect(updatedPerson.status).toBe(200);
      expect(updatedPerson.body.name).toBe(person.name);
      expect(updatedPerson.body.id).toBe(person.id);
      done();
    });
  });

  it('should update a contato', done => {
    const relatedPerson: Person = {
      name: 'Beatiful Person Name',
      rg: '10101010101',
      birthDate: new Date(),
      id: 0
    };
    const contato: Contato = {
      name: 'Beatiful Contato Name',
      id: 0,
      person: relatedPerson
    };
    const expected = { body: contato, status: 200 };
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 10);
    });
    spyOn(service, 'saveContato').and.returnValue(observable);
    service.saveContato(contato).subscribe(updatedContato => {
      expect(updatedContato.status).toBe(200);
      expect(updatedContato.body.name).toBe(contato.name);
      expect(updatedContato.body.id).toBe(contato.id);
      done();
    });
    expect(service).toBeTruthy();
  });

  it('should delete a persistent person', done => {
    const expected = { body: null, status: 200 };
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 10);
    });
    spyOn(service, 'deletePersonById').and.returnValue(observable);
    service.deletePersonById(1).subscribe(updatedPerson => {
      expect(updatedPerson.status).toBe(200);
      done();
    });
  });

  it('should delete a persistent contato', done => {
    const relatedPerson: Person = {
      name: 'Beatiful Person Name',
      rg: '10101010101',
      birthDate: new Date(),
      id: 0
    };
    const contato: Contato = {
      name: 'Beatiful Contato Name',
      id: 0,
      person: relatedPerson
    };
    const expected = { body: contato, status: 200 };
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 10);
    });
    spyOn(service, 'deleteContatoById').and.returnValue(observable);

    service.deleteContatoById(contato.id).subscribe(updatedContato => {
      expect(updatedContato.status).toBe(200);
      done();
    });
    expect(service).toBeTruthy();
  });
});
