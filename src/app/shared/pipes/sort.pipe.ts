import { Pipe, PipeTransform } from '@angular/core';

/**
 * | sort: 'asc' : 'name' : 'John'
 */

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(arr: any[], sortDir: 'asc' | 'desc' = 'asc', objProp: string): any {
    //console.log(arr, sortDir, objProp);
    let arrayNew = arr;

    const sortAsc = (a: any, b: any) => a[objProp] - b[objProp];
    const sortDesc = (a: any, b: any) => b[objProp] - a[objProp];

    if (objProp) {
      arrayNew = sortDir == 'asc' ? arrayNew.sort(sortAsc) : arrayNew.sort(sortDesc);
    } else {
      arrayNew = sortDir == 'asc' ? arrayNew.sort() : arrayNew.reverse();
    }
    //console.log(arrayNew)
    return arrayNew;
  }
}
