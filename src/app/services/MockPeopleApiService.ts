import { Observable, of } from 'rxjs';
import { PersonContatoEntity } from '../Entities';
import { HttpResponse } from '@angular/common/http';
import { isUndefined, isNull } from 'util';

export class MockPeopleApiService {
  authenticated = false;
  getContatoByPersonId(): Observable<any> {
    return of({
      body: [
        {
          id: 1,
          name: 'Contato Name',
          person: null
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
        birthDate: null
      }
    });
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
