import { Injectable } from '@angular/core';
import { Router, RoutesRecognized, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/interval';

import { UIModalService } from '@ui';
import { ApiService } from '@api';
import { IStore } from '../stores/store';
import { AppSettings } from '../app.settings';

@Injectable()
export class AuthService {
  // If this app does not yet have an auth endpoint, set to false.
  // This will allow dev to proceed since a token is required by the route guard
  public hasAuthEndpoint = false;
  /** Location of auth endpoint */
  private authUrl = '/authentication/login';

  /** Is session expired */
  public sessionExpired = false;
  /** How long to show the modal window */
  public modalDuration = 12; // 120 
  /** Holds the logout session timer */
  public sessionTimer: any = null; // 
  /** Holds reference to logout modal */
  public logOutModal: NgbModalRef;
  /** The http call so a token can be refreshed with a callback and success method */
  public refreshToken = this.http.put(this.settings.apiUrl + '/authentication/token', null);
  /** If a token is passed in without logging in no timer duration is present. Default to this */
  private setTimerDefaultSeconds = 5; // 5 minutes

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<IStore.root>,
    private settings: AppSettings,
    private modals: UIModalService,
    private api: ApiService
  ) {
    // If token is passed in via query param, update settings. Standard query param: /#/?token=123456
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams.token) {
        this.settings.token = queryParams.token;
        this.setTimer(this.setTimerDefaultSeconds); // Start the session timer with the default time
      }
    });

    // If a token is passed in via matrix notation params, update app settings.
    // Need to use matrix notation /#/route;token=123456456456
    this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized && val.state.root.firstChild.params.token) {
        this.settings.token = val.state.root.firstChild.params.token;
        this.setTimer(this.setTimerDefaultSeconds); // Start the session timer with the default time
      }
    });
  }

  /**
   * Log the user in
   * @param data
   */
  public logIn(data) {
    const url = this.settings.apiUrl + this.authUrl;

    // If no auth endpoint set up yet, use a get and set the token properties so the rest of the app can work
    if (!this.hasAuthEndpoint) {
      return this.http.get('assets/mock-data/login.json').map((response: any) => {
        this.settings.token = response.data.token;
        this.sessionExpired = false;
        this.setTimer(response.data.expirationSeconds);
        return response;
      });
    }
    // Auth point is configured
    return this.http.post(url, data).map((response: any) => {
      this.settings.token = response.data.token;
      this.sessionExpired = false;
      this.setTimer(response.data.expirationSeconds);
      return response;
    });
  }// end LogIn

  /**
   * Refresh the token
   */
  public refreshTokenUpdate(): void {
    this.refreshToken.subscribe(
      (response: any) => {
        // Make sure a token is present before it is replaced
        if (this.settings.token) {
          // console.log('Refreshing token', response);
          this.sessionExpired = false;
          this.settings.token = response.data.token;
          this.setTimer(response.data.expirationSeconds);
        }
        return true;
      },
      (response: any) => {
        // console.log('Error refreshing token');
        this.logOut();
      }
    );
  } // end RefreshToken

  /**
   * Set a countdown timer that pops a modal window when the user is close to session timeout
   * @param ExpirationSeconds
   */
  private setTimer(expirationSeconds: number): void {
    // console.log('Setting session timer to ', ExpirationSeconds, ' seconds');
    clearTimeout(this.sessionTimer);
    // ExpirationSeconds = 20;
    this.sessionTimer = setTimeout(() => {
      // console.log('Timer Expired');
      this.sessionExpired = true;
      this.launchLogoutModal();
      // Double the modal duration to add a buffer between server countdown and browser countdown
    }, (expirationSeconds - this.modalDuration * 2) * 1000); 
  } // end SetTimer

  /**
   * Launch a modal window which gives the user a chance to continue working
   */
  private launchLogoutModal(): void {
    clearTimeout(this.sessionTimer);
    // Open log out modal window
    this.modals.open('LogoutModalComponent', false, 'lg', this.modalDuration).result.then((closeReason) => {
      this.logOut();
    }, (dismissReason) => {// When modal is dismissed
      if (dismissReason !== 'norefresh') {
        this.refreshTokenUpdate();
      }
    });

  } // end launchLogoutModal

  /**
   * Log the user out. Clear stored data and redirect to login page
   */
  public logOut(): void {
    clearTimeout(this.sessionTimer);
    this.settings.token = null;
    this.api.resetStore(); // Clear out all API data on log out for security
    // Don't throw a redirect url if this is the dashboard since that is default on login
    const returnUrl = this.router.url !== '/' ? this.router.url : null;
    this.router.navigate(['/login'], { queryParams: { returnUrl: returnUrl } });
  } // end LogOut

}
