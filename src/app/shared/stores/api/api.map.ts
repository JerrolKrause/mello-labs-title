/**
Adding a new endpoints:
1. Create a new property in the ApiProps enum in api.properties.ts
2. Create a new entry in api.map. Add endpoint, store property and uniqueID
3. Add the end data location in the main store state in api.state.ts
*/

// import IStore
import { IStore } from '@shared';
import { ApiProps } from './api.properties';
// IStore.ApiMap
import * as _ from 'lodash';

export const ApiMap: IStore.ApiMapping = {

  loans: {
    endpoint: '/assets/mock-data/loans.json',
    storeProperty: ApiProps.loans,
    uniqueId: 'id',
    mapSrc: 'src',
    map: (users: any[]) => {
      let dict = {};
      users.forEach(user => {
        dict[user.lnkey] = user;
      });
      return {
        src: users,
        dict: dict
      };
    }
  },

  // Example
  vesting: {
    endpoint: '/assets/mock-data/vesting.json',
    storeProperty: ApiProps.vesting,
  },

  // Example
  users: {
    endpoint: '//jsonplaceholder.typicode.com/users',
    storeProperty: ApiProps.users,
    uniqueId: 'id',
    mapSrc: 'src',
    map: (users: any[]) => {
      // Sample dictionary mapping based on id property
      const dict = {};
      users.forEach(user => dict[user.id] = user);
      return {
        src: users,
        dict: dict
      };
    }
  }

};
