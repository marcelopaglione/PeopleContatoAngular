import { Component, OnInit, ComponentRef, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { ReponseMessage, Contato, Page } from 'src/app/Entities';
import { Router, ActivatedRoute  } from '@angular/router';
import { isNull } from 'util';
import { NewContatoComponent } from '../../contato/new-contato.component';

@Component({
  selector: 'app-manage-person',
  templateUrl: './manage-person.component.html',
  styleUrls: ['./manage-person.component.scss']
})
export class ManagerPersonComponent implements OnInit {

  @ViewChild('viewContainerRef', { read: ViewContainerRef }) VCR: ViewContainerRef;

  constructor(
    private formBuilder: FormBuilder,
    private api: PeopleApiService,
    private CFR: ComponentFactoryResolver,
    private route: ActivatedRoute,
    private router: Router
  ) { this.route.params.subscribe(params => { this.idFromUrlParam = params.id; }); }

  title = '';
  idFromUrlParam = 0;
  fg: FormGroup;
  response: ReponseMessage = {message: '', status: ''};
  contatos: Contato[] = [];
  page: Page = {
    content: [],
    first: true,
    last: false,
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 10,
    numberOfElements: 0,
    empty: true
  };

  index = 0;
  componentsReferences = [];

  ngOnInit() {
    this.initializePageData();
    this.setApplicationTitle();
  }

   setApplicationTitle() {
    if (isNull(this.fg.value.id)) {
      this.title = 'Cadastrar Nova Pessoa';
    } else {
      this.title = 'Editar Pessoa';
    }
  }

   initializePageData() {
    this.initializeForm();
    this.cleanContatos();
    this.loadPerson();
  }

   loadPerson() {
    if (this.idFromUrlParam) {
      this.api.getPersonById(this.idFromUrlParam)
      .subscribe(person => {
        this.fg.patchValue(person.body);
        this.fg.patchValue({birthDate: this.formatDate(person.body.birthDate.toString())});
        this.setApplicationTitle();
      });

      this.loadContatos();
    }
  }

   loadContatos() {
    if (this.idFromUrlParam) {
      this.api.getContatoByPersonId(this.idFromUrlParam)
      .subscribe(paginatedContatos => {
        paginatedContatos.body.map(contato => {
          this.createComponent(contato);
        });
      });
    }
  }

   cleanContatos()  {
    this.componentsReferences.map(contato => {
      this.cleanComponents(contato.instance.index);
      this.idFromUrlParam = null;

    });
  }

   initializeForm() {
    this.fg = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      rg: [null, Validators.required],
      birthDate: ['', Validators.required]
    });
  }

   isContatosInvalid() {
    let contatIsInvalid = false;
    this.componentsReferences.map(contato => {
        if (!contato.instance.fg.value.name) {
          this.response.message = 'Por favor informe o nome dos contatos';
          this.response.status = 'warning';
          contatIsInvalid = true;
          return;
        }
    });
    return contatIsInvalid;
  }

   getContatos() {
    const contatos = [];
    this.componentsReferences.map(contato => {
      const contatoForm: Contato = contato.instance.fg.value;
      contatoForm.person = this.fg.value;
      contatos.push(contatoForm);
    });
    return contatos;
  }

   isBirthDateInvalid() {
    if (!this.validateDate(this.fg.value.birthDate)) {
      this.response.message = 'Data de nascimento está inválida';
      this.response.status = 'warning';
      return true;
    }
    return false;
  }

   formatDateFromUserInput() {
    this.fg.patchValue({birthDate: this.toDate(this.fg.value.birthDate)});
  }

   formatDate(dateToFormt: string) {
    const dateArray = dateToFormt.substr(0, 10).split('-');
    const day = dateArray[2];
    const month = dateArray[1];
    const year = dateArray[0];
    return day + '/' + month + '/' + year;
  }

   createEntityToPersist() {
    const saveEntity = {
      contatos: this.getContatos(),
      person: this.fg.value
    };
    return saveEntity;
  }

   isValidFormToSubmit() {
    if (!this.fg.valid || (this.isBirthDateInvalid()) || (this.isContatosInvalid()) ) {
      return false;
    }

    return true;
  }

   savePerson() {
    if (!this.isValidFormToSubmit()) {
      return;
    }
    this.formatDateFromUserInput();
    const entityToPersist = this.createEntityToPersist();
    this.api.savePersonAndContato(entityToPersist).subscribe(data => {
      if (data.status === 200) {
        this.response.message = `${this.fg.value.name} foi salvo com sucesso!`;
        this.response.status = 'success';
        this.initializePageData();
      }
    }, err => {
      if (err.status === 400) {
        this.response.message = 'Os valores informados estão inválidos, tente novamente!';
        this.response.status = 'warning';
      } else {
        this.response.message = err.error.message;
        this.response.status = 'danger';
      }
    });
  }

  createComponent(contato: Contato) {
    const componentFactory = this.CFR.resolveComponentFactory(NewContatoComponent);
    const componentRef: ComponentRef<NewContatoComponent> = this.VCR.createComponent(componentFactory);
    const currentComponent = componentRef.instance;
    currentComponent.selfRef = currentComponent;
    currentComponent.index = ++this.index;
    currentComponent.compInteraction = this;
    componentRef.instance.fg = this.formBuilder.group({
      id: [contato ? contato.id : null],
      name: [contato ? contato.name : null, Validators.required],
      person: [contato ? contato.person : null]
    });
    this.componentsReferences.push(componentRef);
  }

  createEmptyComponenet() {
    this.createComponent(null);
  }

  cleanComponents(index: number) {
    const componentRef = this.componentsReferences.filter(x => x.instance.index === index)[0];
    this.removeVisualComponent(componentRef, index);
  }

  remove(index: number) {
    if (this.VCR.length < 1) {
      return;
    }
    const componentRef = this.componentsReferences.filter(x => x.instance.index === index)[0];

    if (isNull(componentRef.instance.fg.value.id)) {
      this.removeVisualComponent(componentRef, index);
      return;
    }

    if (!confirm(`Você ter certeza que deseja remover ${componentRef.instance.fg.value.name}`)) {
      return;
    }

    this.api.deleteContatoById(componentRef.instance.fg.value.id).subscribe(data => {
      if (data.status === 200) {
        this.removeVisualComponent(componentRef, index);
        this.response.message = `Contato Removido com sucesso`;
        this.response.status = 'success';
      } else {
        this.response.message = `Não foi possível remover contato, Por favor tente novamente mais tarde`;
        this.response.status = 'warning';
      }
    });
  }

   removeVisualComponent(componentRef: any, index: number) {
    const vcrIndex: number = this.VCR.indexOf(componentRef);
    this.VCR.remove(vcrIndex);
    this.componentsReferences = this.componentsReferences.filter(x => x.instance.index !== index);
  }

   toDate(dateStr): Date {
    const [day, month, year] = dateStr.toString().split('/');
    return new Date(year, month - 1, day);
  }

   validateDate(date: string): boolean {
    const dateRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
    if (!(dateRegex.test(date))) {
      return false;
    }
    return true;
  }

   navigateBack() {
    this.router.navigate(['home']);
  }

}
