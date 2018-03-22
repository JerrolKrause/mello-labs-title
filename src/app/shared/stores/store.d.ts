export declare namespace IStore {
  /*************************
  * App specific interfaces
  *************************/

  /** API Store */
  interface api {
    loans?: Mapped<any[]>;
    notes?: Mapped<any[]>;
    contacts?: Mapped<any[]>;
    loanCurrent?: Mapped<any[]>;
    loanCurrentOcr?: any[];
    loanCurrentDocs?: any[];
    // Example of Store typing with mapped response
    users?: Mapped<{
      user: string;
      email: string;
      name: string;
      phone: string;
      username: string;
      website: string;
    }>;
  }

  /** The API Map */
  export interface ApiMapping {
    users?: ApiMap;
    loans?: ApiMap;
    contacts?: ApiMap;
    loanCurrent?: ApiMap;
    loanCurrentOcr?: ApiMap;
    loanCurrentDocs?: ApiMap;
    vesting?: ApiMap;
    notes?: ApiMap;
  }

  /** UI Store */
  interface ui {
    modal?: {
      modalId: string;
      options: {};
      data: any;
    };
    docViewerGuids?: string[];
    multiscreen?: boolean;
    multiDocs?: boolean;
    loanContacts?: boolean;
    loanHasUpdate: boolean;
    tabViewer?: number;
    tabDashboard?: number;
    tabForm?: number;
    forms: {
      loan?: any;
      borrower?: any;
      vesting?: any;
    }
  }


  /*************************
  * Non-customizable interfaces
  *************************/

  /** The root store which contains the other stores */
  interface root {
    api?: api;
    ui?: ui;
    apiStatus?: apiStatus;
  }

  /** API status store */
  interface apiStatus {
    [key: string]: ApiStatus;
  }

  /** Example pattern for data that is mapped before being passed into the store */
  interface Mapped<T> {
    /** Unaltered source of API response */
    src?: T[];
    /** A dictionary organized by the primary key */
    dict?: { [key: string]: T };
    /** A deduped array arranged into a dictionary by primary key */
    uniques?: { [key: string]: T };
  }

  interface StateStatuses {
    // Example
    users?: ApiStatus;
  }

  interface ApiStatus {
    loading?: boolean;
    loaded?: boolean;
    loadError?: any;

    modifying?: boolean;
    modified?: boolean;
    modifyError?: any;
  }

  /** Maps the relationship between the store and the API. Automates all the interaction. */
  export interface ApiMap {
    /** The location of the rest API endpoint */
    endpoint?: string;
    /** The location/property of where to put the API response into the store */
    storeProperty?: string;
    /** A unique ID of each object in the collection. Also supports an array of strings if multiple unique ID's are needed in the event of a single key not being enough. */
    uniqueId?: string | string[];
    /** A callback function to modify the API response before it is inserted into the store */
    map?: any;
    /** If a map callback function is specified, this is the key for the location of the original unfiltered list of items. This is necessary to update the mapped list in the store without a GET all */
    mapSrc?: string;
    /** Occasionally a unique piece of information needs to be passed to the reducer from the method.  This property can have data assigned to pass to the reducer */
    data?: any;
  }



  interface Rest {
    storeProp: string;
    path: string;
  }
}
