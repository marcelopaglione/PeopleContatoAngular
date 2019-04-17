import { Injectable } from '@angular/core';
import { Contato, ReponseMessage } from 'src/app/Entities';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { isNullOrUndefined } from 'util';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagePersonService {
  contatos = [];
  response: ReponseMessage = { message: '', status: '' };

  constructor(private api: PeopleApiService) {}

  appAddContatoComponent(inputContato: Contato) {
    this.contatos.push(inputContato);
  }



  eventRemoveContatoFromDatabase(contato: Contato) {
    this.removeContatoFromDatabase(contato).subscribe();
  }
  removeContatoFromDatabase(contato: Contato): Observable<any> {
    return this.api.deleteContatoById(contato.id).pipe(
      map(data => {
        if (data.status === 200) {
          this.eventRemoveVisualContatoComponent(contato);
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
      })
    );
  }

  eventRemoveVisualContatoComponent(contato: Contato) {
    this.contatos = this.contatos.filter((value, index, arr) => {
      return value !== contato;
    });
  }

  setResponse(event: { status: string; message: string }) {
    this.response.message = event.message;
    this.response.status = event.status;
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

  isAllContatosValid() {
    if (this.contatos.every(contato => !isNullOrUndefined(contato.name))) {
      return true;
    } else {
      this.setResponse({
        status: 'warning',
        message: 'Preencha o nome de todos os contatos'
      });
      return false;
    }
  }
}
