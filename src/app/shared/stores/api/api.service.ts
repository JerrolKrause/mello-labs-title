import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ApiHttpService, ApiActions } from '@mello-labs/api-tools';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import { AppSettings, IStore } from '@shared';
import { ApiMap } from './api.map';
import { ApiProps } from './api.properties';

@Injectable()
export class ApiService extends ApiHttpService {
  /** Location of prod app environment settings */
  public envSettingsUrlProd = 'api/config'; // Localize
  /** Location of dev app environment settings */
  public envSettingsUrlDev = 'assets/mock-data/env-settings.json';

  // Store selectors
  /** Users store selection */
  public users$ = this.store.select(store => store.api.users);
  

  public loans$ = this.store.select(store => store.api.loans);
  public notes$ = this.store.select(store => store.api.notes);
  public contacts$ = this.store.select(store => store.api.contacts);

  public loanCurrent$ = this.store.select(store => store.api.loanCurrent);
  public loanCurrentOcr$ = this.store.select(store => store.api.loanCurrentOcr);
  public loanCurrentDocs$ = this.store.select(store => store.api.loanCurrentDocs);
  public loanCurrentStatus$ = this.getStatuses(<any>[
    this.store.select(store => store.apiStatus[ApiProps.loanCurrent]),
    this.store.select(store => store.apiStatus[ApiProps.loanCurrentOcr]),
  ]);

  constructor(
    private http: HttpClient,
    private store: Store<IStore.root>,
    private router: Router,
    private settings: AppSettings,
  ) {
    super(<any>http, <any>store, <any>router);
    // Output store changes to console
    // this.store.subscribe(store => console.log(JSON.parse(JSON.stringify(store))));

    // On instantiation, load environment settings
    this.appSettingsGet().subscribe(
      appSettings => this.appSettingsUpdate(appSettings),
      error => console.error('Unable to get env settings', error, this.http),
    );
  }

  // API endpoints
  /** Users endpoint */
  public users = {
    get: (update?: boolean) => this.getStore(ApiMap.users.endpoint, ApiMap.users, update),
    getOne: (user: any, update?: boolean) => this.getStore(ApiMap.users.endpoint + '/' + user.id, ApiMap.users, update),
    post: (user: any) => this.postStore(ApiMap.users.endpoint, ApiMap.users, user),
    put: (user: any) => this.putStore(ApiMap.users.endpoint + '/' + user.id, ApiMap.users, user),
    delete: (user: any) => this.deleteStore(ApiMap.users.endpoint + '/' + user.id, ApiMap.users, user),
  };

  public contacts = {
    get: (loanNumber: string, update?: boolean) =>
      this.getStore(ApiMap.contacts.endpoint + '?' + loanNumber, ApiMap.contacts, update),
  };

  public loans = {
    get: (update?: boolean) => this.getStore(ApiMap.loans.endpoint, ApiMap.loans, update),
  };

  public loanCurrent = {
    get: (update?: boolean) => this.getStore(ApiMap.loanCurrent.endpoint, ApiMap.loanCurrent, update),
  };

  public loanCurrentOcr = {
    get: (update?: boolean) => this.getStore(ApiMap.loanCurrentOcr.endpoint, ApiMap.loanCurrentOcr, update),
  };

  public loanCurrentDocs = {
    get: (update?: boolean) => this.getStore(ApiMap.loanCurrentDocs.endpoint, ApiMap.loanCurrentDocs, update),
  };

  public vesting = {
    get: (update?: boolean) => this.getStore(ApiMap.vesting.endpoint, ApiMap.vesting, update),
  };

  public notes = {
    get: (loanNumber: string, update?: boolean) =>
      this.getStore(ApiMap.notes.endpoint + '?' + loanNumber, ApiMap.notes, update),
  };

  /** Get the API state using api props */
  public getState$ = (apiProp: ApiProps) => this.store.select(store => store.apiStatus[apiProp]);
  /** Get the API data using api props */
  //public getData$ = (apiProp: ApiProps) => this.store.select(store => store.api[apiProp]);

  /**
   * Set all env settings in app settings
   * @param settings
   */
  public appSettingsUpdate(settings: any) {
    this.settings.apiUrl = settings.ApiUrl;
  }

  /**
   * Get app and user settings needed by the API. This needs to happen before any subsequent calls
   */
  public appSettingsGet(update?: boolean) {
    // If app is localhost:4200, use local settings settings instead

    const envUrl = this.settings.isDev ? this.envSettingsUrlDev : this.envSettingsUrlProd;
    return this.get(envUrl, update).catch(error => {
      if (error.status === 401 || error.status === 403) {
        error.errorMsg = 'Unable to get start up settings ';
        sessionStorage.clear();
        this.router.navigate(['/']);
        return Observable.throw(false);
      } else {
        return Observable.throw(error);
      }
    });
  }

  /**
   * Reset the store, clear out all held state and data
   */
  public resetStore() {
    this.cache = {}; // Clear cache
    this.store.dispatch({
      type: ApiActions.RESET,
      payload: null,
    }); // Update store with new state
  }

  /**
   * Reset all errors in the api state
   */
  public resetErrors(): void {
    this.store.dispatch({
      type: ApiActions.RESET_ERRORS,
      payload: null,
    }); // Update store with new state
  }

  /**
   * Reset all errors in the api state
   */
  public resetSuccess(): void {
    this.store.dispatch({
      type: ApiActions.RESET_SUCCESS,
      payload: null,
    }); // Update store with new state
  }
}
