import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Page } from 'src/app/Entities';


@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  inBetweenPages: number[] = [];
  @Input() page: Page = {
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
  @Input() searchString;
  @Output() eventChangeMaxItemsPerPage = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.configureInBetweenPages();
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

  public changeMaxItemsPerPage(maxItemsPerPage: number) {
    this.page.size = maxItemsPerPage;
    this.page.number = 0;
    this.eventChangeMaxItemsPerPage.emit({event: 'changeMaxItemsPerPage', page: this.page});
    this.configureInBetweenPages();
  }

  public updateListViewAtPage() {
    this.eventChangeMaxItemsPerPage.emit({event: 'search', page: this.page});
    this.configureInBetweenPages();
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

}
