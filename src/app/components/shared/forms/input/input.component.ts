import { Component, OnInit, Input } from '@angular/core';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent  {

  constructor() { }

  @Input() label;
  @Input() value;
  @Input() disabled;

}
