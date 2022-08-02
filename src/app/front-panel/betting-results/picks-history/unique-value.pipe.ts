import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

// declare var _: any; 

@Pipe({
  name: 'unique',
  pure: false
})

export class UniquePipe implements PipeTransform {
    transform(items: any[], args: any[]): any {

        // lodash uniqBy function
        return _.uniqBy(items, args);
    }
}