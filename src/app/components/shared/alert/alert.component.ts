import { Component, OnInit, Input } from '@angular/core';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { ReponseMessage } from 'src/app/Entities';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  constructor() {}

  @Input() reponseMessage: ReponseMessage = { message: '', status: '' };

  ngOnInit() {}
}
