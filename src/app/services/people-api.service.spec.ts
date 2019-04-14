import { TestBed } from '@angular/core/testing';

import { PeopleApiService } from './people-api.service';
import { HttpClientModule } from '@angular/common/http';
import { Page, Person, Contato, PersonContatoEntity } from '../Entities';
import { Observable, of } from 'rxjs';

describe('PeopleApiService', () => {
  let service: PeopleApiService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    })
  );

  beforeEach(() => {
    service = TestBed.get(PeopleApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a paginated list of people', done => {

    const page: Page = {
      content: null,
      last: false,
      totalElements: 51,
      totalPages: 11,
      number: 2,
      size: 5,
      numberOfElements: 5,
      first: false,
      empty: false
    };

    const expected = {
      body: {
        size: 5,
        number: 2
      },
      status: 200
    };

    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 200);
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
    const page: Page = {
      content: null,
      last: false,
      totalElements: 51,
      totalPages: 11,
      number: 2,
      size: 5,
      numberOfElements: 5,
      first: false,
      empty: false
    };

    const expected = {
      status: 200
    };

    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 200);
    });

    spyOn(service, 'getContatos').and.returnValue(observable);
    service.getContatos(page).subscribe(data => {
      expect(data.status).toBe(200);
      done();
    });
  });

  it('should get a paginated list of contatos by personId', done => {
    const expected = {
      status: 200
    };

    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 200);
    });

    spyOn(service, 'getContatoByPersonId').and.returnValue(observable);
    service.getContatoByPersonId(1).subscribe(data => {
      expect(data.status).toBe(200);
      done();
    });
  });

  it('should get a person by id', done => {
    const expected = {
      body: { id: 1 },
      status: 200
    };

    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 200);
    });

    spyOn(service, 'getPersonById').and.returnValue(observable);
    service.getPersonById(1).subscribe(data => {
      expect(data.status).toBe(200);
      expect(data.body.id).toBe(1);
      done();
    });
  });

  it('should get a contato by id', done => {
    const expected = {
      body: { id: 51 },
      status: 200
    };

    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 200);
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
    const page: Page = {
      content: null,
      last: false,
      totalElements: 51,
      totalPages: 11,
      number: 2,
      size: 5,
      numberOfElements: 5,
      first: false,
      empty: false
    };
    const expected = {
      body: { content: [] },
      status: 200
    };
    expected.body.content.push({ name: nameToSearch });

    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 200);
    });

    spyOn(service, 'getPersonByNameContaining').and.returnValue(observable);
    service.getPersonByNameContaining(nameToSearch, page).subscribe(data => {
      expect(data.status).toBe(200);
      data.body.content.map(person => {
        expect(person.name).toContain(nameToSearch);
      });
      done();
    });
    expect(service).toBeTruthy();
  });

  it('should get a contato by name containing string', done => {
    const nameToSearch = 'NameToSearch';
    const expected = {
      body: [],
      status: 200
    };
    expected.body.push({ name: nameToSearch });

    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 200);
    });

    spyOn(service, 'getContatoByNameContaining').and.returnValue(observable);
    service.getContatoByNameContaining(nameToSearch).subscribe(data => {
      expect(data.status).toBe(200);
      data.body.map(contato => {
        expect(contato.name).toContain(nameToSearch);
      });
      done();
    });
    expect(service).toBeTruthy();
  });

  it('should create and persist a person', done => {
    const person: Person = {
      name: 'Beatiful Name',
      rg: '10101010101',
      birthDate: new Date(),
      id: 1
    };

    const expected = {
      body: person,
      status: 201
    };
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 200);
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
    expect(service).toBeTruthy();
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

    const expected = {
      body: contato,
      status: 201
    };
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 200);
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
      name: 'Person should create and persist one person and his 3 contatos',
      rg: '10101010101',
      birthDate: new Date(),
      id: 0
    };
    const contato1: Contato = {
      name: 'Contact 1 should create and persist one person and his 3 contatos',
      id: 0,
      person: relatedPerson
    };
    const contato2: Contato = {
      name: 'Contact 2 should create and persist one person and his 3 contatos',
      id: 0,
      person: relatedPerson
    };
    const contato3: Contato = {
      name: 'Contatc 3 should create and persist one person and his 3 contatos',
      id: 0,
      person: relatedPerson
    };

    const saveEntity: PersonContatoEntity = {
      person: relatedPerson,
      contatos: [contato1, contato2, contato3]
    };

    const expected = {
      body: saveEntity,
      status: 200
    };
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 200);
    });
    spyOn(service, 'savePersonAndContato').and.returnValue(observable);

    service.savePersonAndContato(saveEntity).subscribe(data => {
      expect(data.status).toBe(200);
      done();
    });
    expect(service).toBeTruthy();
  });

  it('should to update a person', done => {
    const person: Person = {
      name: 'Beatiful Name',
      rg: '10101010101',
      birthDate: new Date(),
      id: 1
    };

    const expected = {
      body: person,
      status: 200
    };
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);

        observer.complete();
      }, 200);
    });
    spyOn(service, 'savePerson').and.returnValue(observable);
    service.savePerson(person).subscribe(updatedPerson => {
      expect(updatedPerson.status).toBe(200);
      expect(updatedPerson.body.name).toBe(person.name);
      expect(updatedPerson.body.id).toBe(person.id);
      done();
    });
    expect(service).toBeTruthy();
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

    const expected = {
      body: contato,
      status: 200
    };
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 200);
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
    const expected = {
      body: null,
      status: 200
    };
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 200);
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
    const expected = {
      body: contato,
      status: 200
    };
    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        observer.complete();
      }, 200);
    });
    spyOn(service, 'deleteContatoById').and.returnValue(observable);

    service.deleteContatoById(contato.id).subscribe(updatedContato => {
      expect(updatedContato.status).toBe(200);
      done();
    });
    expect(service).toBeTruthy();
  });
});
