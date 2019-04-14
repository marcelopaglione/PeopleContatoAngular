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
  inBetweenPages: number[] = [];
  searchString = '';
  page: Page = {
    content: [],
    first: true,
    last: false,
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 10,
    numberOfElements: 0,
    empty: true
  };

  ngOnInit() {
    this.loadPeoplePaginatedFromDatabase();
  }

  private loadPeoplePaginatedFromDatabase() {
    this.api.getPeople(this.page).subscribe(paginatedPeople => {
      this.setPaginatedDataIntoPeople(paginatedPeople);
      this.configureInBetweenPages();
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

  private configureInBetweenPages() {
    const curretPage = this.page.number + 1;
    const totalPages = this.page.totalPages;
    this.inBetweenPages = [];

    if (curretPage > 10) { this.inBetweenPages.push(curretPage - 10); }
    if (curretPage > 5) { this.inBetweenPages.push(curretPage - 5); }
    if (curretPage > 2) { this.inBetweenPages.push(curretPage - 2); }
    if (curretPage > 1) { this.inBetweenPages.push(curretPage - 1); }
    this.inBetweenPages.push(curretPage);
    if (curretPage + 1 <= totalPages) { this.inBetweenPages.push(curretPage + 1); }
    if (curretPage + 2 <= totalPages) { this.inBetweenPages.push(curretPage + 2); }
    if (curretPage + 5 <= totalPages) { this.inBetweenPages.push(curretPage + 5); }
    if (curretPage + 10 <= totalPages) { this.inBetweenPages.push(curretPage + 10); }
  }

  public nextPage() {
    this.page.number = this.page.number + 1;
    this.updateListViewAtPage();
  }

  public prevPage() {
    this.page.number = this.page.number - 1;
    this.updateListViewAtPage();
  }

  public firstPage() {
    this.page.number = 0;
    this.updateListViewAtPage();
  }

  public lastPage() {
    this.page.number = this.page.totalPages - 1;
    this.updateListViewAtPage();
  }

  public gotoPage(pageNumber: number) {
    this.page.number = pageNumber;
    this.updateListViewAtPage();
  }

  public editarPerson(personId: number) {
    this.router.navigate([`person/${personId}`]);
  }

  public viewDetails(personId: number) {
    this.router.navigate([`details/${personId}`]);
  }

  private updateListViewAtPage() {
    if (this.searchString !== '') {
      this.search();
    } else {
      this.loadPeoplePaginatedFromDatabase();
    }
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
    this.resetPageToZero();
    this.search();
  }

  private resetPageToZero() {
    this.page.number = 0;
  }

  private search() {
    if (this.searchString === '') {
      this.loadPeoplePaginatedFromDatabase();
      return;
    }

    this.api.getPersonByNameContaining(this.searchString, this.page)

    .subscribe(paginatedPeople => {
      this.setPaginatedDataIntoPeople(paginatedPeople);
      this.configureInBetweenPages();
    });
  }

  public changeMaxItemsPerPage(maxItemsPerPage: number) {
    this.page.size = maxItemsPerPage;
    this.searchFromInputUser();
  }

}
