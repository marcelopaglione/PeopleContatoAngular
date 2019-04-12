import { Component, OnInit, ComponentRef, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { ReponseMessage, Contato, Page } from 'src/app/Entities';
import { NewContatoComponent } from '../../contato/new-contato/new-contato.component';

@Component({
  selector: 'app-new-person',
  templateUrl: './new-person.component.html',
  styleUrls: ['./new-person.component.scss']
})
export class NewPersonComponent implements OnInit {

  @ViewChild('viewContainerRef', { read: ViewContainerRef }) VCR: ViewContainerRef;

  constructor(
    private formBuilder: FormBuilder,
    private api: PeopleApiService,
    private CFR: ComponentFactoryResolver
  ) { }

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
  }

  private initializePageData() {
    this.fg = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      rg: [null, Validators.required],
      birthDate: ['', Validators.required]
    });

    const id = this.fg.value.id;
    if (id) {
      this.api.getContatoByPersonId(id, this.page)
      .subscribe(paginatedContatos => {
        console.log('contatos ' + JSON.stringify(paginatedContatos.body));
        paginatedContatos.body.map(contato => {
          this.createComponent(contato);
        });
      });
    }
  }

  private saveContatos() {
    console.log('Save contatos: ');
    this.componentsReferences.map(contato => {
      console.log(contato.instance.fg.value);
    });
  }

  public savePerson() {
    this.saveContatos();
    if (this.fg.valid) {
      if (!this.validateDate(this.fg.value.birthDate)) {
        this.response.message = 'O formato da data de nascimento está incorreto';
        this.response.status = 'warning';
        return;
      }
      this.fg.patchValue({birthDate: this.toDate(this.fg.value.birthDate)});
      console.log(this.fg.value);
      this.api.savePerson(this.fg.value).subscribe(data => {
        if (data.status === 201) {
          this.response.message = `${this.fg.value.name} foi inserido com sucesso!`;
          this.response.status = 'success';
          this.initializePageData();
        }
      }, err => {
        console.log(err);
        if (err.status === 400) {
          this.response.message = 'Os valores informados estão inválidos, tente novamente!';
          this.response.status = 'warning';
        } else {
          this.response.message = err.error.message;
          this.response.status = 'danger';
        }
      });
    } else {
      console.log('Invalid boleto form: ' + JSON.stringify(this.fg.value));
    }
  }

  createComponent(contato: Contato) {
    const componentFactory = this.CFR.resolveComponentFactory(NewContatoComponent);
    const componentRef: ComponentRef<NewContatoComponent> = this.VCR.createComponent(componentFactory);
    const currentComponent = componentRef.instance;
    currentComponent.selfRef = currentComponent;
    currentComponent.index = ++this.index;
    currentComponent.compInteraction = this;
    componentRef.instance.fg = this.formBuilder.group({
      id: [null],
      name: [contato ? contato.name : null, Validators.required],
      person: [null]
    });
    console.log(componentRef.instance);
    this.componentsReferences.push(componentRef);
  }

  createEmptyComponenet() {
    this.createComponent(null);
  }

  remove(index: number) {
    if (this.VCR.length < 1) {
      return;
    }
    const componentRef = this.componentsReferences.filter(x => x.instance.index === index)[0];
    const vcrIndex: number = this.VCR.indexOf(componentRef);
    // removing component from container
    this.VCR.remove(vcrIndex);
    this.componentsReferences = this.componentsReferences.filter(x => x.instance.index !== index);
  }

  private toDate(dateStr): Date {
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
  }

  private validateDate(date: string): boolean {
    const isValidDate = this.toDate(date);
    console.log(`validate date ${isValidDate}`);

    if (!isValidDate.getDate()) {
      return false;
    }
    return true;
  }

}
