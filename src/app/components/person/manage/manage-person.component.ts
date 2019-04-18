import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, FormControl } from '@angular/forms';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { Contato,  PersonContatoEntity, Page } from 'src/app/Entities';
import { Router, ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { map, tap, delay, distinctUntilChanged } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-manage-person',
  templateUrl: './manage-person.component.html',
  styleUrls: ['./manage-person.component.scss']
})
export class ManagerPersonComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private api: PeopleApiService,
    private activaedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activaedRoute.params.subscribe(params => {
      this.idFromUrlParam = params.id;
    });
  }

  idFromUrlParam = 0;
  title: string;
  contatos: Contato[] = [];
  response = { message: '', status: '' };
  fg: FormGroup;

  ngOnInit() {
    isNullOrUndefined(this.idFromUrlParam)
      ? (this.title = 'Cadastrar Nova Pessoa')
      : (this.title = 'Editar Pessoa');

    this.fg = this.formBuilder.group({
        id: [null],
        name: [null, [Validators.required, Validators.minLength(3)], [this.validateNameExistsOnDatabase.bind(this)]],
        rg: [null, [Validators.required, Validators.minLength(8)]],
        birthDate: [null, [Validators.required]]
      });
    this.initializePageContent();
  }

  validateNameExistsOnDatabase(fg: FormGroup) {
    const page: Page = {
      content: [],
      first: true,
      last: false,
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 5,
      numberOfElements: 0,
      empty: true
    };
    return this.api
    .getPersonByExactName(fg.value, page)
    .pipe(
      distinctUntilChanged(),
      delay(2000),
      map(data => data.body),
      // tap(data => console.log(1, data)),
      map(data => data.content),
      // tap(data => console.log(data)),
      map(data => data.length > 0 ? { userAlredyExists: true } : {}),
      // tap(console.log),
    );
  }

  appAddContatoComponent(inputContato: Contato = { name: null, id: 0, person: null }) {
    this.contatos.push(inputContato);
  }

  eventRemoveContatoFromDatabase(contato: Contato) {
    this.removeContatoFromDatabase(contato).subscribe();
  }
  removeContatoFromDatabase(contato: Contato): Observable<any> {
    return this.api.deleteContatoById(contato.id).pipe(
      map(data => {
        if (data.status === 200) {
          this.eventRemoveVisualContatoComponent(contato);
          this.setResponse({
            status: 'success',
            message: 'Contato Removido com sucesso'
          });
        } else {
          this.setResponse({
            status: 'warning',
            message:
              'Não foi possível remover contato, Por favor tente novamente mais tarde'
          });
        }
      })
    );
  }

  eventRemoveVisualContatoComponent(contato: Contato) {
    this.contatos = this.contatos.filter((value) => {
      return value !== contato;
    });
  }

  setResponse(event: { status: string; message: string }) {
    this.response.message = event.message;
    this.response.status = event.status;
  }

  isAllContatosValid() {
    if (this.contatos.every(contato => !isNullOrUndefined(contato.name))) {
      return true;
    } else {
      this.setResponse({
        status: 'warning',
        message: 'Preencha o nome de todos os contatos'
      });
      return false;
    }
  }

  initializePageContent() {
    this.loadPerson();
    this.loadContatos();
  }

  private loadPerson() {
    if (this.idFromUrlParam) {
      this.api
        .getPersonById(this.idFromUrlParam)
        .subscribe(person => {
          this.fg.patchValue(person.body);
        });
    }
  }

  private loadContatos() {
    if (this.idFromUrlParam) {
      this.api
        .getContatoByPersonId(this.idFromUrlParam)
        .subscribe(contatos => {
          contatos.body.map(contato => {
            this.appAddContatoComponent(contato);
          });
        });
    }
  }

  private createEntityToPersist() {
    const entity: PersonContatoEntity = {
      contatos: this.contatos,
      person: {
        id: this.fg.value.id,
        name: this.fg.value.name,
        birthDate: this.fg.value.birthDate,
        rg: this.fg.value.rg
      }
    };
    entity.contatos.map(c => (c.person = entity.person));
    return entity;
  }

  save() {
    if (!this.isAllContatosValid()) {
      return;
    }
    const entityToPersist = this.createEntityToPersist();
    return this.api.savePersonAndContato(entityToPersist)
      .subscribe(data => {
        if (data.status === 200 || data.status === 201) {
          this.setResponse({
            status: 'success',
            message: `${this.fg.value.name} foi salvo com sucesso!`
          });
          this.fg.reset();
          this.contatos = [];
        }
      });

  }

  removeContato(contato: Contato) {
    if (!this.dialogConfirmDeleteContaot(contato)) {
      return;
    }
    if (contato.id !== 0) {
      this.eventRemoveContatoFromDatabase(contato);
      return;
    }
    this.eventRemoveVisualContatoComponent(contato);
  }

  private dialogConfirmDeleteContaot(contato: Contato) {
    return confirm(`Você tem certeza que deseja remover ${contato.name}`);
  }

  navigateBack() {
    this.router.navigate(['home']);
  }

}
