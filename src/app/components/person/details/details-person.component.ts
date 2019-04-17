import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Person, Contato, PersonContatoEntity } from 'src/app/Entities';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

@Component({
  selector: 'app-view-person',
  templateUrl: './details-person.component.html',
  styleUrls: ['./details-person.component.scss']
})
export class DetailsPersonComponent implements OnInit {
  idFromUrlParam = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private api: PeopleApiService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.idFromUrlParam = params.id;
    });
  }

  allData$: Observable<PersonContatoEntity>;

  ngOnInit() {
    this.allData$ = this.personContatos();
  }

  personContatos(): Observable<PersonContatoEntity> {
    return combineLatest(this.person(), this.contatos()).pipe(
      map(([p, c]) => {
        return { person: p, contatos: c };
      })
    );
  }

  private person(): Observable<Person> {
    return this.api
      .getPersonById(this.idFromUrlParam)
      .pipe(map(data => data.body));
  }

  private contatos(): Observable<Contato[]> {
    return this.api
      .getContatoByPersonId(this.idFromUrlParam)
      .pipe(map(data => data.body));
  }

  navigateBack() {
    this.router.navigate(['home']);
  }

  editPerson() {
    this.router.navigate([`person/${this.idFromUrlParam}`]);
  }

  trackByFn(index: number) {
    return index;
  }
}
