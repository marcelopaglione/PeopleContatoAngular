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

  removeContato(contato: Contato) {
    if (!this.dialogConfirmDeleteContaot(contato)) {
      return;
    }
    if (contato.id !== 0) {
      this.eventRemoveContatoFromDatabase(contato);
      return;
    }
    this.eventRemoveVisualContatoComponent(contato);
  }

  private dialogConfirmDeleteContaot(contato: Contato) {
    return confirm(`Você tem certeza que deseja remover ${contato.name}`);
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

  private eventRemoveVisualContatoComponent(contato: Contato) {
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

  validateDate(date: string): boolean {
    const dateRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
    if (!dateRegex.test(date)) {
      return false;
    }
    return true;
  }

  isValidFormToSubmit(fg: FormGroup) {
    if (
      this.ifFormGroupInvalid(fg) ||
      this.isBirthDateInvalid(fg.value.birthDate) ||
      !this.isAllContatosValid()
    ) {
      return false;
    }
    return true;
  }

  private isBirthDateInvalid(birthDate: string) {
    if (!this.validateDate(birthDate)) {
      this.setResponse({
        status: 'warning',
        message: 'Data de nascimento está inválida'
      });
      return true;
    }
    return false;
  }

  private ifFormGroupInvalid(fg: FormGroup) {
    if (!fg.valid) {
      this.setResponse({
        status: 'warning',
        message: 'Formulário inválido'
      });
      return true;
    }
    return false;
  }

  private isAllContatosValid() {
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
