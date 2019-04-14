import { TestBed } from '@angular/core/testing';

import { PeopleApiService } from './people-api.service';
import { HttpClientModule } from '@angular/common/http';
import { Page, Person, Contato, PersonContatoEntity } from '../Entities';
import { Observable, of } from 'rxjs';

describe('PeopleApiService', () => {
  let service: PeopleApiService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));

  beforeEach(() => {
    service = TestBed.get(PeopleApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a paginated list of people', (done) => {
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
      status: 200,
    };

    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        console.log('am done');
        observer.complete();
      }, 2000);
    });

    spyOn(service, 'getPeople').and.returnValue(observable);

    service.getPeople(page).subscribe(data => {
      expect(data.status).toBe(200);
      expect(data.body.size).toBe(5);
      expect(data.body.number).toBe(2);
      done();
    });

  });

  it('should get a ist of contatos', (done) => {
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
      status: 200,
    };

    const observable = Observable.create(observer => {
      setTimeout(() => {
        observer.next(expected);
        console.log('am done');
        observer.complete();
      }, 2000);
    });

    spyOn(service, 'getContatos').and.returnValue(observable);
    service.getContatos(page).subscribe(data => {
      expect(data.status).toBe(200);
      done();
    });

  });

  it('should get a paginated list of contatos by personId', (done) => {
    service.getContatoByPersonId(1).subscribe(data => {
      expect(data.status).toBe(200);
      done();
    });

  });

  it('should get a person by id', (done) => {
    service.getPersonById(1)
    .subscribe(data => {
      expect(data.status).toBe(200);
      expect(data.body.id).toBe(1);
      done();
    });
    expect(service).toBeTruthy();
  });

  it('should get a contato by id', (done) => {
    service.getContatoById(51)
    .subscribe(data => {
      expect(data.status).toBe(200);
      expect(data.body.id).toBe(51);
      done();
    });
    expect(service).toBeTruthy();
  });

  it('should get a person by name containing string', (done) => {
    const nameToSearch = '1';
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
    service.getPersonByNameContaining(nameToSearch, page)
    .subscribe(data => {
      expect(data.status).toBe(200);
      data.body.content.map(person => {
        expect(person.name).toContain(nameToSearch);
      });
      done();
    });
    expect(service).toBeTruthy();
  });

  it('should get a contato by name containing string', (done) => {
    const nameToSearch = '1';
    service.getContatoByNameContaining(nameToSearch)
    .subscribe(data => {
      expect(data.status).toBe(200);
      data.body.map(person => {
        expect(person.name).toContain(nameToSearch);
      });
      done();
    });
    expect(service).toBeTruthy();
  });

  it('should create and persist a person', (done) => {
    const person: Person = {
      name: 'Beatiful Name',
      rg: '10101010101',
      birthDate: new Date(),
      id: 0
    };

    service.savePerson(person)
    .subscribe(data => {
      expect(data.status).toBe(201);
      expect(data.body.name).toBe(person.name);
      expect(data.body.rg).toBe(person.rg);
      expect(new Date(data.body.birthDate)).toEqual(person.birthDate);
      expect(data.body.id).toBeGreaterThan(0);
      done();
    });
    expect(service).toBeTruthy();
  });

  it('should create and persist a contato', (done) => {
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

    service.saveContato(contato)
    .subscribe(data => {
      expect(data.status).toBe(201);
      expect(data.body.name).toBe(contato.name);
      expect(data.body.id).toBeGreaterThan(0);
      done();
    });
    expect(service).toBeTruthy();
  });

  it('should create and persist one person and his 3 contatos', (done) => {
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

    service.savePersonAndContato(saveEntity)
    .subscribe(data => {
      expect(data.status).toBe(200);
      done();
    });
    expect(service).toBeTruthy();
  });


  it('should create, persist and update a person', (done) => {
    const person: Person = {
      name: 'Beatiful Name',
      rg: '10101010101',
      birthDate: new Date(),
      id: 0
    };

    service.savePerson(person)
    .subscribe(responsePerson => {
      expect(responsePerson.status).toBe(201);
      expect(responsePerson.body.name).toBe(person.name);
      expect(responsePerson.body.rg).toBe(person.rg);
      expect(new Date(responsePerson.body.birthDate)).toEqual(person.birthDate);
      expect(responsePerson.body.id).toBeGreaterThan(0);

      person.name = 'Not So Beatiful Name';
      person.id = responsePerson.body.id;
      service.savePerson(person)
      .subscribe(updatedPerson => {
        expect(updatedPerson.status).toBe(200);
        expect(updatedPerson.body.name).toBe(person.name);
        expect(updatedPerson.body.id).toBe(person.id);
        done();
      });
    });
    expect(service).toBeTruthy();
  });

  it('should create, persist and update a contato', (done) => {
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

    service.saveContato(contato)
    .subscribe(responseContato => {
      expect(responseContato.status).toBe(201);
      expect(responseContato.body.name).toBe(contato.name);
      expect(responseContato.body.id).toBeGreaterThan(0);

      contato.name = 'Not So Beatiful Name';
      contato.id = responseContato.body.id;
      contato.person.id = responseContato.body.person.id;
      service.saveContato(contato)
      .subscribe(updatedContato => {
        expect(updatedContato.status).toBe(200);
        expect(updatedContato.body.name).toBe(contato.name);
        expect(updatedContato.body.id).toBe(contato.id);
        done();
      });
    });
    expect(service).toBeTruthy();
  });

  it('should create and delete a persistent person', (done) => {
    const person: Person = {
      name: 'Beatiful Name',
      rg: '10101010101',
      birthDate: new Date(),
      id: 0
    };

    service.savePerson(person)
    .subscribe(responsePerson => {
      expect(responsePerson.status).toBe(201);
      expect(responsePerson.body.name).toBe(person.name);
      expect(responsePerson.body.rg).toBe(person.rg);
      expect(new Date(responsePerson.body.birthDate)).toEqual(person.birthDate);
      expect(responsePerson.body.id).toBeGreaterThan(0);

      person.id = responsePerson.body.id;
      service.deletePersonById(person.id)
      .subscribe(updatedPerson => {
        expect(updatedPerson.status).toBe(200);
        done();
      });
    });
    expect(service).toBeTruthy();
  });

  it('should create and delete a persistent contato', (done) => {
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

    service.saveContato(contato)
    .subscribe(responseContato => {
      expect(responseContato.status).toBe(201);
      expect(responseContato.body.name).toBe(contato.name);
      expect(responseContato.body.id).toBeGreaterThan(0);

      contato.id = responseContato.body.id;
      service.deleteContatoById(contato.id)
      .subscribe(updatedContato => {
        expect(updatedContato.status).toBe(200);
        done();
      });
    });
    expect(service).toBeTruthy();
  });
});
