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

  constructor() { }

  fg: FormGroup;
  public index: number;
  public selfRef: NewContatoComponent;
  public compInteraction: ContatoInterface;

  removeMe(index) {
    this.compInteraction.remove(index);
  }

}
