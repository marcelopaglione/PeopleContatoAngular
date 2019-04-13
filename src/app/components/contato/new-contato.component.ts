import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { Person, Contato } from 'src/app/Entities';

export interface myinterface {
  remove(index: number);
}
@Component({
  selector: 'app-new-contato',
  templateUrl: './new-contato.component.html',
  styleUrls: ['./new-contato.component.scss']
})
export class NewContatoComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private api: PeopleApiService
  ) { }

  @Input() importedPerson: Person;
  @Output() contato: Contato;

  fg: FormGroup;
  public index: number;
  public selfRef: NewContatoComponent;
  public compInteraction: myinterface;

  removeMe(index) {
    this.compInteraction.remove(index);
  }

  ngOnInit() {
    // this.initializePageData();
  }

  private initializePageData() {
    this.fg = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      person: [this.importedPerson, Validators.required]
    });
  }

}
