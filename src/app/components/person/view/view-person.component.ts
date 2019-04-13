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
    this.validateUrlParameter();
    this.loadPersonAndItsContatos();
  }

  loadPersonAndItsContatos() {
    this.api.getPersonById(this.idFromUrlParam)
    .subscribe(person => {
      this.person = person.body;
      this.loadContatos(person.body.id);
    });
  }

  loadContatos(id: number) {
    this.api.getContatoByPersonId(id)
    .subscribe(contatos => {
      this.setContatos(contatos.body);
    });
  }

  setContatos(contatos: Contato[]) {
    this.contatos = contatos;
  }

  validateUrlParameter() {
    // tslint:disable-next-line: triple-equals
    if (this.idFromUrlParam == 0 || this.idFromUrlParam || isNaN(this.idFromUrlParam)) {
      // console.log('nativate to home');
    }
  }

  navigateBack() {
    this.router.navigate(['home']);
  }

  editPerson() {
    this.router.navigate([`person/${this.person.id}`]);
  }

}
