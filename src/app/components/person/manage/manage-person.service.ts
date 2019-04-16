import {
  Injectable,
  ComponentRef,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver
} from '@angular/core';
import { Contato, ReponseMessage } from 'src/app/Entities';
import { NewContatoComponent } from '../../contato/new-contato.component';
import { PeopleApiService } from 'src/app/services/people-api.service';

@Injectable({
  providedIn: 'root'
})
export class ManagePersonService {
  contatos = [];
  response: ReponseMessage = { message: '', status: '' };

  constructor(
    private api: PeopleApiService,
    private resolver: ComponentFactoryResolver
  ) {}

  appAddContatoComponent(inputContato: Contato = { name: null, id: 0, person: null }) {
    console.log('pusing contato ', inputContato);
    this.contatos.push(inputContato);
  }

  private subscribeRemoveEvent(
    newContatoComponent: ComponentRef<NewContatoComponent>
  ) {
    newContatoComponent.instance.event.subscribe(event =>
      this.eventDeleteContato(event)
    );
  }

  private eventDeleteContato(deleteEvent: {
    contato: Contato;
    componentIndex: number;
  }) {
    if (deleteEvent.contato.id !== 0) {
      if (
        !confirm(
          `Você ter certeza que deseja remover ${deleteEvent.contato.name}`
        )
      ) {
        return;
      }
      this.eventRemoveContatoFromDatabase(deleteEvent);
    } else {
      this.eventRemoveVisualContatoComponent(deleteEvent);
    }
  }

  private eventRemoveContatoFromDatabase(deleteEvent: {
    contato: Contato;
    componentIndex: number;
  }) {
    this.api
      .deleteContatoById(deleteEvent.contato.id)
      .toPromise()
      .then(data => {
        if (data.status === 200) {
          this.eventRemoveVisualContatoComponent(deleteEvent);
          this.setResponse({
            status: 'success',
            message: 'Contato Removido com sucesso'
          });
        } else {
          this.setResponse({
            status: 'warning',
            message:
              'Não foi possível remover contato, Por favor tente novamente mais tarde'
          });
        }
      });
  }

  private eventRemoveVisualContatoComponent(deleteEvent: {
    contato: Contato;
    componentIndex: number;
  }) {/*
    this.entry.remove(
      this.entry.indexOf(
        this.contatosComponent.find(
          contatoComponent =>
            contatoComponent.instance.index === deleteEvent.componentIndex
        )
      )
    );*/
  }

  removeAllContatosComponents() {
    // fazer splice aqui
    /*this.contatos.map(contatoComponent => {
      this.entry.remove(this.entry.indexOf(contatoComponent));
    });*/
  }

  setResponse(event: { status: string; message: string }) {
    this.response.message = event.message;
    this.response.status = event.status;
  }

  toDate(dateStr): Date {
    const [day, month, year] = dateStr.toString().split('/');
    return new Date(year, month - 1, day);
  }

  formatDate(dateToFormt: string) {
    const dateArray = dateToFormt.substr(0, 10).split('-');
    const day = dateArray[2];
    const month = dateArray[1];
    const year = dateArray[0];
    return `${day}/${month}/${year}`;
  }

  toDatabaseDate(dateStr): string {
    const [day, month, year] = dateStr.toString().split('/');
    return `${year}-${month}-${day}`;
  }

  validateDate(date: string): boolean {
    console.log('validate date', date);
    const dateRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
    if (!dateRegex.test(date)) {
      return false;
    }
    return true;
  }
}
