import { Component, OnInit, EventEmitter } from '@angular/core';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { Person, Page } from 'src/app/Entities';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private api: PeopleApiService, private router: Router) {}

  searchString = '';
  page: Page = {
    content: [],
    first: true,
    last: false,
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 5,
    numberOfElements: 0,
    empty: true
  };
  initPage: EventEmitter<Page> = new EventEmitter();

  ngOnInit() {
    this.loadPeoplePaginatedFromDatabase();
  }

  loadPeoplePaginatedFromDatabase() {
    this.api.getPeople(this.page)
    .pipe(map(data => data.body))
    .subscribe(paginatedPeople => {
      this.initPage.emit(paginatedPeople);
      this.page = paginatedPeople;
    });
  }

  editarPerson(personId: number) {
    this.router.navigate([`person/${personId}`]);
  }

  viewDetails(personId: number) {
    this.router.navigate([`details/${personId}`]);
  }

  removerPerson(person: Person) {
    if (confirm(`Você ter certeza que deseja remover ${person.name}`)) {
      this.api.deletePersonById(person.id)
        .subscribe(data => {
          data.status === 200 ?
          this.loadPeoplePaginatedFromDatabase() :
          alert(`Houve um erro ao deletar person ${person}`);
      });
    }
  }

  keyDownFunction(event: { keyCode: any; }) {
    if (event.keyCode === 13) {
      this.page.number = 0;
      this.search();
    }
  }

  search() {
    !this.searchString ?
    this.loadPeoplePaginatedFromDatabase() :
    this.api
      .getPersonByNameContaining(this.searchString, this.page)
      .pipe(map(data => data.body))
      .subscribe(body => {
        this.page = body;
        this.initPage.emit(body);
      });
  }

  reciverFeedbackFromPagination(feedback: { page: Page; }) {
    this.page = feedback.page;
    this.search();
  }
}
