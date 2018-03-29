import { Pipe, PipeTransform } from '@angular/core';
/**
 * Filters an array of strings or an array of objects
 * USAGE:  | filter: 'John' : 'fullName'
 */
@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(arr: string[], searchValue: string | boolean, objProp: string) {
    // If no string value, return whole array
    if (!searchValue && searchValue != false) {
      return arr;
    }
    // Clean up the string to make matching easier
    const simplifyString = (str: string | boolean) => {
      return str
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/gi, '');
    };

    return arr.filter((elem: any) => {
      // If objProp was supplied, search the prop within the object, otherwise its a string array and search that
      const stringSearch = objProp ? simplifyString(elem[objProp]) : simplifyString(elem);
      // If includes, return value
      return stringSearch.includes(simplifyString(searchValue)) ? true : false;
    });
  }
}
