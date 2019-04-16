import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-new-contato',
  templateUrl: './new-contato.component.html',
  styleUrls: ['./new-contato.component.scss']
})
export class NewContatoComponent {
  constructor(private formBuilder: FormBuilder) {}

  @Input() index: number;
  @Output() event = new EventEmitter();

  fg: FormGroup = this.formBuilder.group({
    id: [null],
    name: [null, Validators.required],
    person: [null]
  });

  removeMe() {
    this.event.emit({ contato: this.fg.value, componentIndex: this.index });
  }
}
