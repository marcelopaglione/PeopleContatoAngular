import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Page, Person, Contato, PersonContatoEntity } from '../Entities';

@Injectable({
  providedIn: 'root'
})
export class PeopleApiService {

  constructor(
    private http: HttpClient
  ) { }

  private readonly API = environment.API;

  public getPeople(page: Page): any {
    return this.http.get<any>(`${this.API}people?size=${page.size}&page=${page.number}`, this.getHeader());
  }

  public getContatos(page: Page): any {
    return this.http.get<any>(`${this.API}contatos?size=${page.size}&page=${page.number}`, this.getHeader());
  }

  public getPersonById(id: number): any {
    return this.http.get<any>(`${this.API}people/${id}`, this.getHeader());
  }

  public getContatoById(id: number): any {
    return this.http.get<any>(`${this.API}contatos/${id}`, this.getHeader());
  }

  public getPersonByNameContaining(name: string, page: Page): any {
    return this.http.get<any>(`${this.API}people/findByName/${name}?size=${page.size}&page=${page.number}`, this.getHeader());
  }

  public getContatoByNameContaining(name: string): any {
    return this.http.get<any>(`${this.API}contatos/findByName/${name}`, this.getHeader());
  }

  public getContatoByPersonId(id: number, page: Page): any {
    return this.http.get<any>(`${this.API}contatos/findByPersonId/${id}?size=${page.size}&page=${page.number}`, this.getHeader());
  }

  public savePerson(person: Person): any {
    if (person.id && person.id !== 0) {
      return this.http.put<any>(`${this.API}people/`, person, this.getHeader());
    }
    return this.http.post<any>(`${this.API}people/`, person, this.getHeader());
  }

  public saveContato(contato: Contato): any {
    if (contato.id && contato.id !== 0) {
      return this.http.put<any>(`${this.API}contatos/`, contato, this.getHeader());
    }
    return this.http.post<any>(`${this.API}contatos/`, contato, this.getHeader());
  }

  public savePersonAndContato(entity: PersonContatoEntity): any {
    return this.http.post<any>(`${this.API}contatos/savePersonAndContatos/`, entity, this.getHeader());
  }

  public deletePersonById(id: number): any {
    return this.http.delete<any>(`${this.API}people/${id}`, this.getHeader());
  }

  public deleteContatoById(id: number): any {
    return this.http.delete<any>(`${this.API}contatos/${id}`, this.getHeader());
  }

  private getHeader() {
    const httpOptions: { headers; observe; } = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      observe: 'response'
    };
    return httpOptions;
  }
}
