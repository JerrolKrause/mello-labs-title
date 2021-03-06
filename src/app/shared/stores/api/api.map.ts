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
    endpoint: 'assets/mock-data/loans.json',
    storeProperty: ApiProps.loans,
    uniqueId: 'lnkey',
    mapSrc: 'src',
    map: (users: any[]) => {
      // let namesFirst = users.map(user => user.name.split(' ')[0]);
      // let namesLast = users.map(user => _.last(user.name.split(' ')));
      // let states = ['AZ', 'CA', 'CO', 'IL', 'MI', 'NY', 'TX', 'HI', 'OR', 'WA'];

      let usersNew = [...users, ...users, ...users];
      const dict: any = {};
      usersNew = users.map((user: any) => {
        const userNew = { ...user };

        userNew.reviewedCount = _.random(5) + 1;
        userNew.lastStatus = _.shuffle(['Wrong documents', 'Borrower name on title incorrect', 'Missing Documents', 'Condition not met'])[0];
        //userNew.unverified = _.random(60);
        //userNew.complete = userNew.unverified;
        //userNew.exception = _.random(10) > 7 ? true : false;
        //userNew.forReview = _.shuffle(forReview)[0];
        //userNew.lockedBy = _.random(10) > 7 ? _.shuffle(namesFirst)[0] + ' ' + _.shuffle(namesLast)[0] : null;
        //userNew.state = _.shuffle(states)[0];
        //userNew.id = i;
        //userNew.name = _.shuffle(namesFirst)[0] + ' ' + _.shuffle(namesLast)[0];
        //userNew.lnkey = _.random(100000000, 100500000);
        //userNew.loanAmount = _.random(100000, 600000);
        //userNew.borrower = _.random(10) > 3 ? true : false;
        //userNew.vesting = _.random(10) > 5 ? true : false;
        //userNew.property = _.random(10) > 6 ? true : false;
        //userNew.liens = _.random(10) > 4 ? true : false;
        //userNew.notes = _.random(10) > 5 ? true : false;
        //userNew.certification = _.random(100) > 85 ? true : false;
        //if (userNew.certification){
        //  userNew.borrower = userNew.vesting = userNew.property = userNew.liens = userNew.notes = true;
        //}
        //userNew.dateEffective = '2/8/2018';
        //userNew.dateExpiration = '4/21/2018';
        dict[userNew.lnkey] = userNew;
        return userNew;
      });
      // console.log(usersNew)
      // console.log(JSON.stringify(usersNew));

      return {
        src: usersNew,
        dict: dict,
      };
    },
  },

  loanCurrent: {
    endpoint: 'assets/mock-data/100166058-loan.json',
    storeProperty: ApiProps.loanCurrent,
  },

  loanCurrentDocs: {
    endpoint: 'assets/mock-data/100166058-documents.json',
    storeProperty: ApiProps.loanCurrentDocs,
    uniqueId: 'docGuid',
    mapSrc: 'src',
    map: (docs: any[]) => {
      // let forReview = ['orange', 'blue', 'green', 'purple', 'red', '', ''];
      // Sample dictionary mapping based on id property
      const dict: any = {};
      docs.forEach(doc => {
        //user.forReview = _.shuffle(forReview)[0];
        dict[doc.docGuid] = doc;
      });
      docs = _.shuffle(docs);

      // Check if a title report is in the array of docs
      const title = docs.filter(doc => {
        return doc.docName
          .toLowerCase()
          .replace(/[^A-Z0-9]/gi, '')
          .indexOf('titlereport') !== -1
          ? true
          : false;
      });

      // If title is present, move to front of array
      if (title && title[0]) {
        title[0].isTitleReport = true;
        docs = [
          ...title,
          ...docs.filter(doc => {
            return doc.docName
              .toLowerCase()
              .replace(/[^A-Z0-9]/gi, '')
              .indexOf('titlereport') === -1
              ? true
              : false;
          }),
        ];
      }

      // console.log(JSON.stringify(users));
      return {
        src: docs,
        dict: dict,
      };
    },
  },

  loanCurrentOcr: {
    //endpoint: '//loandepot.webhop.net/OCRService/api/GetOcrMetadata',
    endpoint: 'assets/mock-data/100166058-ocr.json',
    storeProperty: ApiProps.loanCurrentOcr,
    uniqueId: 'Id',
    mapSrc: 'src',
    map: (docs: any[]) => {
      // Sample dictionary mapping based on id property
      const dict: any = {};
      docs.forEach(doc => {
        if (!dict[doc.field]){
          dict[doc.field] = [];
        }
        dict[doc.field].push(doc);
      });
      return {
        src: docs,
        dict: dict,
      };
    },
  },

  contacts: {
    endpoint: 'assets/mock-data/loan-contacts.json',
    storeProperty: ApiProps.contacts,
  },

  vesting: {
    endpoint: 'assets/mock-data/vesting.json',
    storeProperty: ApiProps.vesting,
  },

  notes: {
    endpoint: 'assets/mock-data/notes.json',
    storeProperty: ApiProps.notes,
    uniqueId: 'noteDate',
  },

  // Example
  users: {
    endpoint: '//jsonplaceholder.typicode.com/users',
    storeProperty: ApiProps.users,
    uniqueId: 'id',
    mapSrc: 'src',
    map: (users: any[]) => {
      // Sample dictionary mapping based on id property
      const dict: any = {};
      users.forEach(user => (dict[user.id] = user));
      return {
        src: users,
        dict: dict,
      };
    },
  },
};
