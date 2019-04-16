import {
  Component,
  OnInit,
  AfterContentInit
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { Contato,  PersonContatoEntity } from 'src/app/Entities';
import { Router, ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { ManagePersonService } from './manage-person.service';
import { map } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';

@Component({
  selector: 'app-manage-person',
  templateUrl: './manage-person.component.html',
  styleUrls: ['./manage-person.component.scss']
})
export class ManagerPersonComponent implements OnInit, AfterContentInit {
  constructor(
    private formBuilder: FormBuilder,
    private api: PeopleApiService,
    private activaedRoute: ActivatedRoute,
    private router: Router,
    private service: ManagePersonService
  ) {
    this.activaedRoute.params.subscribe(params => {
      this.idFromUrlParam = params.id;
    });
  }

  get response() {
    return this.service.response;
  }

  get contatosComponent() {
    return this.service.contatos;
  }

  get contatos(): Contato[] {
    return this.service.contatos;
  }

  idFromUrlParam = 0;
  title: string;
  contato: Contato[];
  fg: FormGroup = this.formBuilder.group({
    id: [null],
    name: [null, Validators.required],
    rg: [null, Validators.required],
    birthDate: [null, Validators.required]
  });
  person$ = this.api
    .getPersonById(this.idFromUrlParam)
    .pipe(map(data => {
      data.body.birthDate = this.service.formatDate(data.body.birthDate);
      return data.body;
    }));
  contatos$ = this.api
    .getContatoByPersonId(this.idFromUrlParam)
    .pipe(map(data => data.body));

  ngOnInit() {
    isNullOrUndefined(this.idFromUrlParam)
      ? (this.title = 'Cadastrar Nova Pessoa')
      : (this.title = 'Editar Pessoa');
    this.initializePageContent();
  }

  ngAfterContentInit(): void {}

  appAddContatoComponent(
    inputContato: Contato = { name: null, id: 0, person: null }
  ) {
    this.service.appAddContatoComponent(inputContato);
  }

  private initService() {
    this.service.contatos = [];
    this.service.response.status = '';
    this.service.response.message = '';
  }

  initializePageContent() {
    this.initService();
    this.loadPerson();
    this.loadContatos();
  }

  loadPerson() {
    if (this.idFromUrlParam) {
      this.api
        .getPersonById(this.idFromUrlParam)
        .toPromise()
        .then(person => {
          this.fg.patchValue(person.body);
          this.fg.patchValue({
            birthDate: this.service.formatDate(person.body.birthDate.toString())
          });
        });
    }
  }

  loadContatos() {
    if (this.idFromUrlParam) {
      this.api
        .getContatoByPersonId(this.idFromUrlParam)
        .toPromise()
        .then(contatos => {
          contatos.body.map(contato => {
            this.service.appAddContatoComponent(contato);
          });
        });
    }
  }

  loadPersonAndContatos(): Observable<PersonContatoEntity> {
    if (this.idFromUrlParam) {
      return combineLatest(this.person$, this.contatos$).pipe(
        map(([p, c]) => {
          return { person: p, contatos: c };
        })
      );
    }
  }

  private createEntityToPersist() {
    const databaseDateFormat: string = this.service.toDatabaseDate(
      this.fg.value.birthDate
    );
    const entity: PersonContatoEntity = {
      contatos: this.contatos,
      person: {
        id: this.fg.value.id,
        name: this.fg.value.name,
        birthDate: databaseDateFormat,
        rg: this.fg.value.rg
      }
    };
    entity.contatos.map(c => (c.person = entity.person));
    return entity;
  }

  save() {
    this.savePerson().subscribe();
  }

  savePerson(): Observable<any> {
    if (!this.service.isValidFormToSubmit(this.fg)) {
      return of('');
    }
    const entityToPersist = this.createEntityToPersist();
    return this.api.savePersonAndContato(entityToPersist).pipe(
      map(data => {
        if (data.status === 200 || data.status === 201) {
          this.service.setResponse({
            status: 'success',
            message: `${this.fg.value.name} foi salvo com sucesso!`
          });
        }
      })
    );
  }

  navigateBack() {
    this.router.navigate(['home']);
  }

  removeContato(contato: Contato) {
    this.service.removeContato(contato);
  }
}
