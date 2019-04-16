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
  @ViewChild('contatoRef', { read: ViewContainerRef })
  entry: ViewContainerRef;
  contatosComponent = [];
  contatos = [];
  response: ReponseMessage = { message: '', status: '' };

  constructor(
    private api: PeopleApiService,
    private resolver: ComponentFactoryResolver
  ) {}

  appAddContatoComponent(contato: Contato = { name: '', id: 0, person: null }) {
    const factory = this.resolver.resolveComponentFactory(NewContatoComponent);
    const newContatoComponent = this.entry.createComponent(factory);
    newContatoComponent.instance.fg.patchValue(contato);
    newContatoComponent.instance.index = contato.id ? contato.id : Date.now();
    this.subscribeRemoveEvent(newContatoComponent);
    this.contatosComponent.push(newContatoComponent);
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
  }) {
    this.entry.remove(
      this.entry.indexOf(
        this.contatosComponent.find(
          contatoComponent =>
            contatoComponent.instance.index === deleteEvent.componentIndex
        )
      )
    );
  }

  removeAllContatosComponents() {
    this.contatosComponent.map(contatoComponent => {
      this.entry.remove(this.entry.indexOf(contatoComponent));
    });
  }

  setResponse(event: { status: string; message: string }) {
    this.response.message = event.message;
    this.response.status = event.status;
  }
}
