import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { Contato, Page, PersonContatoEntity } from 'src/app/Entities';
import { Router, ActivatedRoute } from '@angular/router';
import { isNull } from 'util';
import { ManagePersonService } from './manage-person.service';
import { map } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';

@Component({
  selector: 'app-manage-person',
  templateUrl: './manage-person.component.html',
  styleUrls: ['./manage-person.component.scss']
})
export class ManagerPersonComponent implements OnInit {
  @ViewChild('contatoRef', { read: ViewContainerRef })
  entry: ViewContainerRef;

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

  allData$: Observable<PersonContatoEntity>;

  ngOnInit() {
    this.allData$ = this.loadPersonAndThenContatos();
    this.initializePageData();
  }

  get response() {
    return this.service.response;
  }

  get contatosComponent() {
    return this.service.contatosComponent;
  }

  get contatos() {
    return this.service.contatos;
  }

  appAddContatoComponent() {
    const internalForm = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      person: [null]
    });
    internalForm.patchValue({name: 'asdasf'});
    this.service.contatos.push([
      {
        fg: internalForm,
        name: 'aaff'
      }
    ]);

    this.service.appAddContatoComponent();
  }

  private initService() {
    this.service.entry = this.entry;
    this.service.contatosComponent = [];
    this.service.response.status = '';
    this.service.response.message = '';
  }

  private getContatosFromContatosComponents() {
    const contatos = [];
    this.service.contatosComponent.map(contato => {
      const contatoForm: Contato = contato.instance.fg.value;
      contatoForm.person = this.fg.value;
      contatos.push(contatoForm);
    });
    return contatos;
  }

  private setApplicationTitle() {
    isNull(this.fg.value.id)
      ? (this.title = 'Cadastrar Nova Pessoa')
      : (this.title = 'Editar Pessoa');
  }

  initializePageData() {
    this.initializeForm();
    this.loadPerson();
    this.initService();
  }

  loadPerson() {
    if (this.idFromUrlParam) {
      this.api
        .getPersonById(this.idFromUrlParam)
        .toPromise()
        .then(person => {
          this.fg.patchValue(person.body);
          this.fg.patchValue({ birthDate: this.formatDate( person.body.birthDate.toString()) });
          this.setApplicationTitle();
        });

      this.loadContatos();
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
      birthDate: ['', Validators.required]
    });
    this.service.removeAllContatosComponents();
  }

  private isBirthDateInvalid() {
    if (!this.validateDate(this.fg.value.birthDate)) {
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
    if (!this.service.contatosComponent.every(item => item.instance.fg.valid)) {
      this.service.setResponse({
        status: 'warning',
        message: 'Preencha o nome de todos os contatos'
      });
      return false;
    }
    return true;
  }

  private isValidFormToSubmit() {
    if (
      this.ifFormGroupInvalid() ||
      this.isBirthDateInvalid() ||
      !this.isAllContatosValid()
    ) {
      return false;
    }
    return true;
  }

  private formatDateFromUserInput() {
    this.fg.patchValue({ birthDate: this.toDate(this.fg.value.birthDate) });
  }

  private formatDate(dateToFormt: string) {
    const dateArray = dateToFormt.substr(0, 10).split('-');
    const day = dateArray[2];
    const month = dateArray[1];
    const year = dateArray[0];
    return `${day}/${month}/${year}`;
  }

  private createEntityToPersist() {
    return {
      contatos: this.getContatosFromContatosComponents(),
      person: this.fg.value
    };
  }

  save() {
    this.service.contatos.map(form => console.log(form));

    this.savePerson().subscribe();
  }

  savePerson(): Observable<any> {
    if (!this.isValidFormToSubmit()) {
      return of('');
    }
    this.formatDateFromUserInput();
    const entityToPersist = this.createEntityToPersist();
    return this.api
    .savePersonAndContato(entityToPersist).pipe(map(
      data => {
        if (data.status === 200 || data.status === 201) {
          this.service.setResponse({ status: 'success', message: `${this.fg.value.name} foi salvo com sucesso!` });
          this.initializePageData();
        }
      },
      err => { err.status === 400 ?
        this.service.setResponse({ status: 'warning', message: 'Os valores informados estão inválidos, tente novamente!'}) :
        this.service.setResponse({ status: 'danger', message: err.error.message });
      }
    ));
  }

  private toDate(dateStr): Date {
    const [day, month, year] = dateStr.toString().split('/');
    return new Date(year, month - 1, day);
  }

  private validateDate(date: string): boolean {
    const dateRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
    if (!dateRegex.test(date)) {
      return false;
    }
    return true;
  }

  navigateBack() {
    this.router.navigate(['home']);
  }
}
