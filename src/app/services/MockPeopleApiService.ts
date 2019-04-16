import { Observable, of } from 'rxjs';

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
}
