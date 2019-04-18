import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('-');
      return { year: this.toInteger(dateParts[2]), month: this.toInteger(dateParts[0]), day: this.toInteger(dateParts[1]) };
    }
    return null;
  }

  format(date: NgbDateStruct): string {
    let stringDate: string = null;
    if (date) {
      stringDate = `${this.padNumber(date.day)}-${this.padNumber(date.month)}-${date.year}`;
    }
    return stringDate;
  }

  private padNumber(value: number) {
    return `0${value}`.slice(-2);
  }

  private toInteger(value: any): number {
    return parseInt(`${value}`, 10);
  }
}
