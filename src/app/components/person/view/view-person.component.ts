import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Person, Contato } from 'src/app/Entities';
import { PeopleApiService } from 'src/app/services/people-api.service';

@Component({
  selector: 'app-view-person',
  templateUrl: './view-person.component.html',
  styleUrls: ['./view-person.component.scss']
})
export class ViewPersonComponent implements OnInit {

  idFromUrlParam = 0;
  person: Person = {id: 0, rg: '', name: '', birthDate: null};
  contatos: Contato[] = [];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: PeopleApiService) { this.route.params.subscribe(params => { this.idFromUrlParam = params.id; });  }

  ngOnInit() {
    this.loadPersonAndItsContatos();
  }

  loadPersonAndItsContatos() {
    this.api.getPersonById(this.idFromUrlParam)
    .subscribe(person => {
      this.person = person.body;
      this.loadContatos(person.body.id);
    });
  }

  private contatoByPersonId(id) {
    return this.api.getContatoByPersonId(id);
  }

  loadContatos(id: number) {
    this.contatoByPersonId(id).toPromise()
    .then(contatos => {
      this.setContatos(contatos.body);
    });
  }

  setContatos(contatos: Contato[]) {
    this.contatos = contatos;
  }

  navigateBack() {
    this.router.navigate(['home']);
  }

  editPerson() {
    this.router.navigate([`person/${this.person.id}`]);
  }

}
