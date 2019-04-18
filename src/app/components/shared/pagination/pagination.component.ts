import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Page } from 'src/app/Entities';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  inBetweenPages: number[] = [];
  @Input() onPageLoad: EventEmitter<Page>;
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

  constructor() {}

  ngOnInit() {
    if (this.onPageLoad) {
      this.onPageLoad.subscribe((data: Page) => {
        this.page = data;
        this.configureInBetweenPages();
      });
    }
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
    this.eventChangeMaxItemsPerPage.emit({
      event: 'changeMaxItemsPerPage',
      page: this.page
    });
    this.configureInBetweenPages();
  }

  public updateListViewAtPage() {
    this.eventChangeMaxItemsPerPage.emit({ event: 'search', page: this.page });
    this.configureInBetweenPages();
  }

  private configureInBetweenPages() {
    const totalPages = this.page.totalPages;
    let curretPage;
    let updatePage = false;
    if (this.page.number + 1 > totalPages) {
      curretPage = totalPages - 1;
      this.page.number = curretPage;
      updatePage = true;
    } else {
      curretPage = this.page.number + 1;
    }
    this.inBetweenPages = [];
    const subpages = [1, 2, 5, 10];
    for (let i = subpages.length - 1; i >= 0; i--) {
      this.addNegativeSubPage(curretPage, subpages[i]);
    }
    if (curretPage <= totalPages && curretPage > 0) { this.inBetweenPages.push(curretPage); }
    for (const subpage of subpages) {
      this.addPositiveSubPage(curretPage, subpage, totalPages);
    }

    if (updatePage) {
      if (curretPage >= 0) {
        this.updateListViewAtPage();
      }
    }
  }

  private addPositiveSubPage(curretPage: number, subPage: number, totalPages: number) {
    if (curretPage + subPage <= totalPages && curretPage > 0) { this.inBetweenPages.push(curretPage + subPage); }
  }

  private addNegativeSubPage(curretPage: number, subPage: number) {
    if (curretPage > subPage && curretPage > 0) { this.inBetweenPages.push(curretPage - subPage); }
  }
}
