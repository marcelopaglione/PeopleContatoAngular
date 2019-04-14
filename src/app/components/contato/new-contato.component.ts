import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface ContatoInterface {
  remove(index: number);
}
@Component({
  selector: 'app-new-contato',
  templateUrl: './new-contato.component.html',
  styleUrls: ['./new-contato.component.scss']
})
export class NewContatoComponent {

  constructor(private formBuilder: FormBuilder) { }

  fg: FormGroup = this.formBuilder.group({
    id: [null],
    name: [null, Validators.required],
    person: [null],
  });
  public index: number;
  public selfRef: NewContatoComponent;
  public compInteraction: ContatoInterface;

  removeMe(index) {
    if (this.compInteraction) { this.compInteraction.remove(index); }
  }

}
