import { Pipe, PipeTransform, Injectable } from '@angular/core';
import * as moment from 'moment';
@Pipe({name: "dateTimeFormatFilter"})
@Injectable()
export class DateTimeFormatPipe implements PipeTransform {
transform(date: any, format: string): any {
    if (date) {
     return moment(date).format(format);
    }
  }
}