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
  person: Person;
  contatos: Contato[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: PeopleApiService) { this.route.params.subscribe(params => { this.idFromUrlParam = params.id; }); }

  ngOnInit() {
    this.validateUrlParameter();
    this.loadPersonAndItsContatos();
  }

  private loadPersonAndItsContatos() {
    this.api.getPersonById(this.idFromUrlParam)
    .subscribe(person => {
      console.log(JSON.stringify(person));

    });
  }

  private validateUrlParameter() {
    // tslint:disable-next-line: triple-equals
    if (this.idFromUrlParam == 0 || this.idFromUrlParam || isNaN(this.idFromUrlParam)) {
      console.log('nativate to home');
    }
  }

}
