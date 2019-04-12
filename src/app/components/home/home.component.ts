import { Component, OnInit } from '@angular/core';
import { PeopleApiService } from 'src/app/services/people-api.service';
import { Person, Page } from 'src/app/Entities';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private api: PeopleApiService
  ) { }

  people: Person[];
  inBetweenPages: number[] = [];
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
      this.people = paginatedPeople.body.content;
      this.page.first = paginatedPeople.body.first;
      this.page.last = paginatedPeople.body.last;
      this.page.totalElements = paginatedPeople.body.totalElements;
      this.page.totalPages = paginatedPeople.body.totalPages;
      this.page.number = paginatedPeople.body.number;
      this.page.size = paginatedPeople.body.size;
      this.page.numberOfElements = paginatedPeople.body.numberOfElements;
      this.page.empty = paginatedPeople.body.empty;
      console.log(this.page);
      this.configureInBetweenPages();
    });
  }


  private configureInBetweenPages() {
    console.log('inbet');
    console.log(this.inBetweenPages);
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
    this.loadPeoplePaginatedFromDatabase();
  }

  public prevPage() {
    this.page.number = this.page.number - 1;
    this.loadPeoplePaginatedFromDatabase();
  }

  public firstPage() {
    this.page.number = 0;
    this.loadPeoplePaginatedFromDatabase();
  }

  public lastPage() {
    this.page.number = this.page.totalPages - 1;
    this.loadPeoplePaginatedFromDatabase();
  }

  public gotoPage(pageNumber: number) {
    this.page.number = pageNumber;
    this.loadPeoplePaginatedFromDatabase();
  }

}
