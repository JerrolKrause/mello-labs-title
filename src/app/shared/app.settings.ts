import { Injectable } from '@angular/core';
import * as _ from 'lodash';

// Enum of app setting properties. Only needed if using the propGet and propSet methods in this file
enum Props {
  token = 'token',
  apiUrl = 'apiUrl',
  userName = 'userName',
  lnkey = 'lnkey',
}

// Getter/setters for app settings. Will read/write to app settings and on app load will try to reload from localstorage/sessionstorage
@Injectable()
export class AppSettings {
  /** Development domains. Used for the isDev property to help set/disable functionality that may not be available yet */
  private domainsDev: string[] = ['localhost:4206', '127.0.0.1:8080', 'jerrolkrause.github.io', 'localhost:49152'];

  /** Is this application in a development environment as defined by domainsDev and window.location.host */
  public get isDev(): boolean {
    return _.includes(this.domainsDev, window.location.host);
  }

  /** API token for EPS */
  private _token: string | null = null;
  /** API token for EPS */
  public get token(): string | null {
    return this._token || this.propGet(Props.token);
  }
  public set token(value: string | null) {
    this._token = value;
    this.propSet(Props.token, value);
  }

  /** Web Api Url */
  private _apiUrl: string | null = null;
  /** Web Api Url */
  public get apiUrl(): string | null {
    return this._apiUrl || this.propGet(Props.apiUrl);
  }
  public set apiUrl(value: string | null) {
    this._apiUrl = value;
    this.propSet(Props.apiUrl, value);
  }

  /** Username */
  private _lnkey: string | null = null;
  /** Username */
  public get lnkey(): string | null {
    return this._lnkey || this.propGet(Props.lnkey);
  }
  public set lnkey(value: string | null) {
    this._lnkey = value;
    this.propSet(Props.lnkey, value);
  }

  /** Username */
  private _userName: string | null = null;
  /** Username */
  public get userName(): string | null {
    return this._userName || this.propGet(Props.userName);
  }
  public set userName(value: string | null) {
    this._userName = value;
    this.propSet(Props.userName, value);
  }

  constructor() {}

  /**
   * Return a property. Loads it from this service first if available, if not looks in localstorage, if not there either return null
   * @param prop - App settings property
   * @param location - Location of locally stored prop, either sessionStorage or localStorage
   */
  private propGet(propKey: string, location: 'localStorage' | 'sessionStorage' = 'localStorage') {
    return window[location].getItem(propKey) || null;
  }

  /**
   * Set an app settings property. Write to localstorage if present, delete from localstorage if null
   * @param prop - App settings property
   * @param location - Location of locally stored prop, either sessionStorage or localStorage
   */
  private propSet(prop: string, value: string | null, location: 'localStorage' | 'sessionStorage' = 'localStorage') {
    if (value) {
      window[location].setItem(prop, value);
    } else {
      window[location].removeItem(prop);
    }
  }
}
