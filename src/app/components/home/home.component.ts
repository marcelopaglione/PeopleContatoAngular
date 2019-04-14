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

  private loadPeoplePaginatedFromDatabase() {
    this.api.getPeople(this.page).subscribe(paginatedPeople => {
      this.setPaginatedDataIntoPeople(paginatedPeople);
    });
  }

  private setPaginatedDataIntoPeople(paginatedPeople: any) {
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

  public editarPerson(personId: number) {
    this.router.navigate([`person/${personId}`]);
  }

  public viewDetails(personId: number) {
    this.router.navigate([`details/${personId}`]);
  }

  public removerPerson(person: Person) {
    if (!confirm(`Você ter certeza que deseja remover ${person.name}`)) {
      return;
    }
    this.api.deletePersonById(person.id).subscribe(data => {
      if (data.status === 200) {
        this.loadPeoplePaginatedFromDatabase();
      } else {
        console.log(`Houve um erro ao deletar person ${person}`);
      }
    });
  }

  public keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.searchFromInputUser();
    }
  }

  public searchFromInputUser() {
    this.page.number = 0;
    this.search();
  }

  private search() {
    if (this.searchString === '') {
      this.loadPeoplePaginatedFromDatabase();
      return;
    }

    this.api.getPersonByNameContaining(this.searchString, this.page)
    .subscribe(paginatedPeople => {
      this.setPaginatedDataIntoPeople(paginatedPeople);
    });
  }

  private updateListViewAtPage() {
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
