import { Component, OnInit } from '@angular/core';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { Person, Page } from 'src/app/Entities';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private api: PeopleApiService,
    private router: Router
  ) { }

  people: Person[];

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

  ngOnInit() {
    this.loadPeoplePaginatedFromDatabase();
  }

  apiLoadPeoplePaginatedFromDatabase() { return this.api.getPeople(this.page); }
  loadPeoplePaginatedFromDatabase() {
    this.apiLoadPeoplePaginatedFromDatabase()
    .subscribe(paginatedPeople => {
      this.setPaginatedDataIntoPeople(paginatedPeople);
    });
  }

  setPaginatedDataIntoPeople(paginatedPeople: any) {
    this.people = paginatedPeople.body.content;
    this.page.first = paginatedPeople.body.first;
    this.page.last = paginatedPeople.body.last;
    this.page.totalElements = paginatedPeople.body.totalElements;
    this.page.totalPages = paginatedPeople.body.totalPages;
    this.page.number = paginatedPeople.body.number;
    this.page.size = paginatedPeople.body.size;
    this.page.numberOfElements = paginatedPeople.body.numberOfElements;
    this.page.empty = paginatedPeople.body.empty;
  }

  editarPerson(personId: number) {
    this.router.navigate([`person/${personId}`]);
  }

  viewDetails(personId: number) {
    this.router.navigate([`details/${personId}`]);
  }

  apiRemovePerson(id) {return this.api.deletePersonById(id);}
  removerPerson(person: Person) {
    if (confirm(`Você ter certeza que deseja remover ${person.name}`)) {
      this.apiRemovePerson(person.id).subscribe(data => {
        data.status === 200 ?
          this.loadPeoplePaginatedFromDatabase() :
          console.log(`Houve um erro ao deletar person ${person}`);
      });
    }
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.searchFromInputUser();
    }
  }

  searchFromInputUser() {
    this.page.number = 0;
    this.search();
  }

  apiGetPersonByNameContaining() { return this.api.getPersonByNameContaining(this.searchString, this.page); }

  search() {
    if (this.searchString === '') {
      this.loadPeoplePaginatedFromDatabase();
      return;
    }

    this.apiGetPersonByNameContaining().toPromise()
    .then(paginatedPeople => {
      this.setPaginatedDataIntoPeople(paginatedPeople);
    });
  }

  updateListViewAtPage() {
    if (this.searchString !== '') {
      this.search();
    } else {
      this.loadPeoplePaginatedFromDatabase();
    }
  }

  reciverFeedbackFromPagination(feedback) {
    console.log('Foi emitido >>>> ', feedback);
    this.page = feedback.page;
    this.updateListViewAtPage();

  }


}
