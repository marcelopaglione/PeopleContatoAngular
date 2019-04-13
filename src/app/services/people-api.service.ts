import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Page, Person, Contato, PersonContatoEntity } from '../Entities';
import { isUndefined, isNull } from 'util';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PeopleApiService {
  constructor(private http: HttpClient) {}

  private readonly API = environment.API;

  public getPeople(page: Page): Observable<HttpResponse<Page>> {
    return this.http
      .get<Page>(`${this.API}people?size=${page.size}&page=${page.number}`, {
        headers: this.getHeaders(),
        observe: 'response'
      })
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.handleErrors(error);
          return throwError(errorMessage);
        })
      );
  }

  public getContatos(page: Page): Observable<HttpResponse<Contato[]>> {
    return this.http
      .get<Contato[]>(
        `${this.API}contatos?size=${page.size}&page=${page.number}`,
        {
          headers: this.getHeaders(),
          observe: 'response'
        }
      )
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.handleErrors(error);
          return throwError(errorMessage);
        })
      );
  }

  public getPersonById(id: number): Observable<HttpResponse<Person>> {
    return this.http
      .get<Person>(`${this.API}people/${id}`, {
        headers: this.getHeaders(),
        observe: 'response'
      })
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.handleErrors(error);
          return throwError(errorMessage);
        })
      );
  }

  public getContatoById(id: number): Observable<HttpResponse<Contato>> {
    return this.http
      .get<Contato>(`${this.API}contatos/${id}`, {
        headers: this.getHeaders(),
        observe: 'response'
      })
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.handleErrors(error);
          return throwError(errorMessage);
        })
      );
  }

  public getPersonByNameContaining(name: string, page: Page): Observable<HttpResponse<Page>> {
    return this.http
      .get<Page>(
        `${this.API}people/findByName/${name}?size=${page.size}&page=${
          page.number
        }`,
        {
          headers: this.getHeaders(),
          observe: 'response'
        }
      )
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.handleErrors(error);
          return throwError(errorMessage);
        })
      );
  }

  public getContatoByNameContaining(name: string): any {
    return this.http
      .get<any>(`${this.API}contatos/findByName/${name}`, {
        headers: this.getHeaders(),
        observe: 'response'
      })
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.handleErrors(error);
          return throwError(errorMessage);
        })
      );
  }

  public getContatoByPersonId(id: number): Observable<HttpResponse<Contato[]>> {
    return this.http
      .get<Contato[]>(
        `${this.API}contatos/findByPersonId/${id}`,
        {
          headers: this.getHeaders(),
          observe: 'response'
        }
      )
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.handleErrors(error);
          return throwError(errorMessage);
        })
      );
  }

  public savePerson(person: Person): Observable<HttpResponse<any>> {
    if (person.id && person.id !== 0) {
      return this.http
        .put<any>(`${this.API}people/`, person, {
          headers: this.getHeaders(),
          observe: 'response'
        })
        .pipe(
          retry(1),
          catchError((error: HttpErrorResponse) => {
            const errorMessage = this.handleErrors(error);
            return throwError(errorMessage);
          })
        );
    }
    return this.http
      .post<any>(`${this.API}people/`, person, {
        headers: this.getHeaders(),
        observe: 'response'
      })
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.handleErrors(error);
          return throwError(errorMessage);
        })
      );
  }

  public saveContato(contato: Contato): Observable<HttpResponse<any>> {
    if (contato.id && contato.id !== 0) {
      return this.http
        .put<any>(`${this.API}contatos/`, contato, {
          headers: this.getHeaders(),
          observe: 'response'
        })
        .pipe(
          retry(1),
          catchError((error: HttpErrorResponse) => {
            const errorMessage = this.handleErrors(error);
            return throwError(errorMessage);
          })
        );
    }
    return this.http
      .post<any>(`${this.API}contatos/`, contato, {
        headers: this.getHeaders(),
        observe: 'response'
      })
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.handleErrors(error);
          return throwError(errorMessage);
        })
      );
  }

  public savePersonAndContato(entity: PersonContatoEntity): Observable<HttpResponse<any>> {
    if (
      entity.person.id === 0 ||
      isUndefined(entity.person.id) ||
      isNull(entity.person.id)
    ) {
      return this.http
        .post<any>(`${this.API}contatos/savePersonAndContatos/`, entity, {
          headers: this.getHeaders(),
          observe: 'response'
        })
        .pipe(
          retry(1),
          catchError((error: HttpErrorResponse) => {
            const errorMessage = this.handleErrors(error);
            return throwError(errorMessage);
          })
        );
    } else {
      return this.http
        .put<any>(`${this.API}contatos/updateContatosAndPeople/`, entity, {
          headers: this.getHeaders(),
          observe: 'response'
        })
        .pipe(
          retry(1),
          catchError((error: HttpErrorResponse) => {
            const errorMessage = this.handleErrors(error);
            return throwError(errorMessage);
          })
        );
    }
  }

  public deletePersonById(id: number): Observable<HttpResponse<any>> {
    return this.http
      .delete<any>(`${this.API}people/${id}`, {
        headers: this.getHeaders(),
        observe: 'response'
      })
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.handleErrors(error);
          return throwError(errorMessage);
        })
      );
  }

  public deleteContatoById(id: number): Observable<HttpResponse<any>> {
    return this.http
      .delete<any>(`${this.API}contatos/${id}`, {
        headers: this.getHeaders(),
        observe: 'response'
      })
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.handleErrors(error);
          return throwError(errorMessage);
        })
      );
  }

  private handleErrors(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return errorMessage;
  }

  private getHeaders(): HttpHeaders | { [header: string]: string | string[] } {
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
  }
}
