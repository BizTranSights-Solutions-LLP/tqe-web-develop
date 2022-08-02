// import { Pipe, PipeTransform } from '@angular/core';
//
// @Pipe({
//   name: 'textsearch',
//   pure: false
// })
// export class TextSearchPipe implements PipeTransform {
//   transform(items: any[], searchText: string, filterArgs: any): any[] {
//     if (!items) return [];
//     if (!searchText) return items;
//     if (searchText.length < 2) return items;
//
//     if (!filterArgs) {
//       filterArgs = {excluded: false};
//     }
//
//     searchText = searchText.toLowerCase();
//     return items.filter( it => {
//       if ((it.excluded === filterArgs.excluded) && !it.ignored) {
//         return it.name.toLowerCase().includes(searchText) || it.team.toLowerCase().includes(searchText)
//       }
//     }).slice(0,20);
//    }
// }
