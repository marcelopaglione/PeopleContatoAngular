import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, FormControl, FormArray } from '@angular/forms';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { Contato,  PersonContatoEntity, Page } from 'src/app/Entities';
import { Router, ActivatedRoute } from '@angular/router';
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

  idFromUrlParam = null;
  title: string;
  response = { message: '', status: '' };
  fg: FormGroup;

  ngOnInit() {
    this.idFromUrlParam ? this.title = 'Editar Pessoa' : this.title = 'Cadastrar Nova Pessoa';

    this.fg = this.formBuilder.group({
        person: this.formBuilder.group({
          id: [null],
          name: [null, [Validators.required, Validators.minLength(3)]],
          rg: [null, [Validators.required, Validators.minLength(8)]],
          birthDate: [null, [Validators.required]],
        }),
        contatos: this.formBuilder.array([])
      });

    this.initializePageContent();
  }

  get contatos(): FormArray { return this.fg.get('contatos') as FormArray; }
  get person(): FormGroup { return this.fg.get('person') as FormGroup; }

  appAddContatoComponent(inputContato?: Contato) {
    const form = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      id: [null],
      person: [null]
    });
    if (inputContato) { form.patchValue(inputContato); }

    this.contatos.push(form);
  }

  removeContatoFromDatabase(contato: Contato, index: number) {
    this.api.deleteContatoById(contato.id).pipe(
      map(data => {
        if (data.status === 200) {
          this.eventRemoveVisualContatoComponent(index);
          this.setResponse({ status: 'success', message: 'Contato Removido com sucesso' });
        }
      })
    ).subscribe();
  }

  eventRemoveVisualContatoComponent(index: number) {
    this.contatos.removeAt(index);
  }

  setResponse(event: { status: string; message: string }) {
    this.response.message = event.message;
    this.response.status = event.status;
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
          this.person.patchValue(person.body);
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

  private updatePersonFromContatos() {
    for (const control of this.contatos.controls) {
      control.patchValue({person: this.person.value});
    }
  }

  save() {
    if (!this.fg.valid) { return; }
    this.updatePersonFromContatos();
    return this.api.savePersonAndContato(this.fg.value).pipe(
      map(data => {
        if (data.status === 200 || data.status === 201) {
          this.setResponse({ status: 'success', message: `${this.person.value.name} foi salvo com sucesso!` });
        }
        return data.body;
      }),
      tap(console.log))
      .subscribe(data => {
        this.fg.patchValue(data);
      });
  }

  removeContato(contatoFormArrayIndex: number) {
    const form = this.contatos.controls[contatoFormArrayIndex];
    if ( !form.value.id ) {
      this.eventRemoveVisualContatoComponent(contatoFormArrayIndex);
      return;
    }

    if (!this.dialogConfirmDeleteContaot(form.value)) {
      return;
    }
    this.removeContatoFromDatabase(form.value, contatoFormArrayIndex);
  }

  private dialogConfirmDeleteContaot(contato: Contato) {
    return confirm(`Você tem certeza que deseja remover ${contato.name}`);
  }

  navigateBack() {
    this.router.navigate(['home']);
  }

}
