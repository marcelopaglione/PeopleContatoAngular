import { Observable, of } from 'rxjs';
import { PersonContatoEntity, Page } from '../Entities';
import { HttpResponse } from '@angular/common/http';
import { isUndefined, isNull, isNullOrUndefined } from 'util';

export class MockPeopleApiService {

  public deletePersonById(id: number): Observable<HttpResponse<any>> {
    if (id) {
      return of (
        new HttpResponse( {
          status: 200,
          body: null
        })
      );
    }
    return of (
      new HttpResponse( {
        status: 404,
        body: null
      })
    );
  }

  public getPeople(page: Page): Observable<HttpResponse<Page>> {
    page.content = [
      {
        id: 1,
        name: `Person Name from mock getPeople`,
        rg: '101010',
        birthDate: new Date(2018, 1, 31)
        }
    ];

    return of (
      new HttpResponse( {
        status: 200,
        body: page
      })
    );
  }

  public getPersonByNameContaining(name: string, page: Page): Observable<HttpResponse<Page>> {
    page.content = [
        {
          id: 1,
          name: `Person ${name}`,
          rg: '101010',
          birthDate: new Date(2018, 1, 31)
        }
    ];

    return of (
      new HttpResponse( {
        status: 200,
        body: page
      })
    );
  }

  getContatoByPersonId(): Observable<any> {
    return of({
      body: [
        {
          id: 1,
          name: 'Contato Name',
          person: {
            id: 1,
            name: 'Person name',
            rg: '101010',
            birthDate: '31/01/1500'
          }
        }
      ]
    });
  }
  getPersonById(): Observable<any> {
    return of({
      body: {
        id: 1,
        name: 'Person name',
        rg: '101010',
        birthDate: '31/01/1500'
      }
    });
  }
  public deleteContatoById(id: number): Observable<HttpResponse<any>> {
    if (id) {
      return of(new HttpResponse( {
        status: 200
      }));
    }
  }
  public savePersonAndContato(
    entity: PersonContatoEntity
  ): Observable<HttpResponse<any>> {
    if (
      entity.person.id === 0 ||
      isUndefined(entity.person.id) ||
      isNull(entity.person.id)
    ) {
      return of(new HttpResponse(
        {
          status: 201
        }
      ));
    } else {
      return of(new HttpResponse(
        {
          status: 200
        }
      ));
    }
  }
}
