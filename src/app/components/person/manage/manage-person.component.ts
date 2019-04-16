import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { Contato, Page, PersonContatoEntity } from 'src/app/Entities';
import { Router, ActivatedRoute } from '@angular/router';
import { isNull, isNullOrUndefined } from 'util';
import { ManagePersonService } from './manage-person.service';
import { map } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';

@Component({
  selector: 'app-manage-person',
  templateUrl: './manage-person.component.html',
  styleUrls: ['./manage-person.component.scss']
})
export class ManagerPersonComponent implements OnInit, AfterViewInit {


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

  title = '';
  idFromUrlParam = 0;
  fg: FormGroup;

  ngOnInit() {
    this.initializePageData();
  }

  ngAfterViewInit(): void {

  }

  get response() {
    return this.service.response;
  }

  get contatosComponent() {
    return this.service.contatos;
  }

  get contatos(): Contato[] {
    console.log('getting contatos ', this.service.contatos);
    return this.service.contatos;
  }

  appAddContatoComponent() {
    this.service.appAddContatoComponent();
  }

  private initService() {
    this.service.contatos = [];
    this.service.response.status = '';
    this.service.response.message = '';
  }

  private setApplicationTitle() {
    isNullOrUndefined(this.fg.value.id)
      ? (this.title = 'Cadastrar Nova Pessoa')
      : (this.title = 'Editar Pessoa');
  }

  initializePageData() {
    this.initializeForm();
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
          this.fg.patchValue({ birthDate: this.service.formatDate( person.body.birthDate.toString()) });
          this.setApplicationTitle();
        });
    } else {
      this.setApplicationTitle();
    }
  }

  loadContatos() {
    if (this.idFromUrlParam) {
      this.api
        .getContatoByPersonId(this.idFromUrlParam)
        .toPromise()
        .then(contatos => {
          contatos.body.map(contato => {
            console.log('loading contato ', contato);
            this.service.appAddContatoComponent(contato);
          });
        });
    }
  }

  loadPersonAndThenContatos() {
    const personObservable = this.api.getPersonById(this.idFromUrlParam).pipe(map(data => data.body));
    const contatosObservable = this.api.getContatoByPersonId(this.idFromUrlParam).pipe(map(data => data.body));
    return combineLatest(personObservable, contatosObservable).pipe(
      map(([p, c]) => {
        return { person: p, contatos: c };
      })
    );
  }

  private initializeForm() {
    this.fg = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      rg: [null, Validators.required],
      birthDate: [null, Validators.required]
    });
    this.service.removeAllContatosComponents();
  }

  private isBirthDateInvalid() {
    if (!this.service.validateDate(this.fg.value.birthDate)) {
      this.service.setResponse({
        status: 'warning',
        message: 'Data de nascimento está inválida'
      });
      return true;
    }
    return false;
  }

  private ifFormGroupInvalid() {
    if (!this.fg.valid) {
      this.service.setResponse({
        status: 'warning',
        message: 'Formulário inválido'
      });
      return true;
    }
    return false;
  }

  private isAllContatosValid() {
    this.service.contatos.map(form => {
      console.log(console.log(form), isNullOrUndefined(form.name));
    });
    if (this.contatos.every(contato => !isNullOrUndefined(contato.name))) {
      return true;
    } else {
      this.service.setResponse({
        status: 'warning',
        message: 'Preencha o nome de todos os contatos'
      });
      return false;
    }

  }

  private isValidFormToSubmit() {
    if (
      !this.isAllContatosValid() ||
      this.ifFormGroupInvalid() ||
      this.isBirthDateInvalid()

    ) {
      return false;
    }
    return true;
  }

  private createEntityToPersist() {
    const databaseDateFormat: string = this.service.toDatabaseDate(this.fg.value.birthDate);
    const entity: PersonContatoEntity  = {
      contatos: this.contatos,
      person: {
        id: this.fg.value.id,
        name: this.fg.value.name,
        birthDate: databaseDateFormat,
        rg: this.fg.value.rg
      }
    };
    entity.contatos.map(c => c.person = entity.person);
    return entity;
  }

  save() {
    this.savePerson().subscribe();
  }

  savePerson(): Observable<any> {
    if (!this.isValidFormToSubmit()) {
      return of('');
    }
    const entityToPersist = this.createEntityToPersist();
    return this.api
    .savePersonAndContato(entityToPersist).pipe(map(
      data => {
        if (data.status === 200 || data.status === 201) {
          this.service.setResponse({ status: 'success', message: `${this.fg.value.name} foi salvo com sucesso!` });
          // this.initializePageData();
        }
      },
      err => { err.status === 400 ?
        this.service.setResponse({ status: 'warning', message: 'Os valores informados estão inválidos, tente novamente!'}) :
        this.service.setResponse({ status: 'danger', message: err.error.message });
      }
    ));
  }

  navigateBack() {
    this.router.navigate(['home']);
  }
}
