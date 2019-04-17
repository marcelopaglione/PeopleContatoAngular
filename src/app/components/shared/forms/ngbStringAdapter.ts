import { NgbDateStruct, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

export class NgbStringAdapter extends NgbDateAdapter<Date> {

  fromModel(date: Date): NgbDateStruct {
    if (!date) { return null; }
    date = new Date(date);
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();

    return { year: yyyy, month: mm, day: dd };
  }

  toModel(date: NgbDateStruct): Date {
    if (!date) { return null; }
    const dateFormat = new Date(date.year, date.month - 1, date.day);
    return dateFormat;
  }
}
