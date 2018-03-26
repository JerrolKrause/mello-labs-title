import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IStore } from '@shared';
import { UIStoreActions, FormTypes } from './ui.store.actions';

import { Subscription } from 'rxjs/Subscription';
import { PostMessageService } from 'src/app/shared/services/post-message.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

export enum MessageActions {
  RESYNC_UI = 'RESYNC_UI',
  END_MULTISCREEN = 'END_MULTISCREEN'
}

@Injectable()
export class UIStoreService {

  public modal$ = this.store.select(store => store.ui.modal);
  public tabViewer$ = this.store.select(store => store.ui.tabViewer);
  public docViewerGuids$ = this.store.select(store => store.ui.docViewerGuids);
  public tabForm$ = this.store.select(store => store.ui.tabForm);
  public tabDashboard$ = this.store.select(store => store.ui.tabDashboard);

  public loanHasUpdate$ = this.store.select(store => store.ui.loanHasUpdate);
  public formBorrower$ = this.store.select(store => store.ui.forms.borrower);
  public formVesting$ = this.store.select(store => store.ui.forms.vesting);
  public formLoan$ = this.store.select(store => store.ui.forms.loan);
  public multiScreen$ = this.store.select(store => store.ui.multiscreen);
  public multiDocs$ = this.store.select(store => store.ui.multiDocs);
  public loanContacts$ = this.store.select(store => store.ui.loanContacts);

  public screen: Window;

  constructor(
    private store: Store<IStore.root>,
    private messaging: PostMessageService,
    private route: ActivatedRoute,
  ) {
    // Rehydrate UI state from localstorage
    if (window.localStorage.getItem('ui')) {
      this.rehydrateUI(JSON.parse(window.localStorage.getItem('ui')));
    }
    this.multiAppCommunication();
    // this.store.subscribe(store => console.log(JSON.parse(JSON.stringify(store))));
  }

  /**
   * Change the active visible tab
   * @param tabType
   * @param tabNum
   */
  public tabChange(tabType: 'dashboard' | 'viewer' | 'form', tabNum:number) {
    this.store.dispatch({ type: UIStoreActions.TAB_CHANGE, payload: { tabType: tabType, tabNum: tabNum } });
    this.resyncUI();
  }

  /**
   * Change the currently visible document in the document viewer
   * @param docID - GUID of document
   */
  public docViewerChange(docViewerInstance: 0 | 1, docGuid: string) {
    this.store.dispatch({ type: UIStoreActions.DOC_CHANGE, payload: { instance: docViewerInstance, docGuid: docGuid } });
    this.resyncUI();
  }

  /**
   * Indicate that a loan has been saved and mark the loanHasUpdate flag to false
   */
  public loanSaved() {
    this.store.dispatch({ type: UIStoreActions.LOAN_SAVED, payload: true });
  }

  /**
   * Toggle multiscreen view which moves the document viewer into its own window
   */
  public multiScreenToggle(multiScreen: boolean = null) {
    this.store.dispatch({ type: UIStoreActions.MULTISCREEN_TOGGLE, payload: multiScreen });
    this.resyncUI();
  }

  /**
   * Toggle the split documents viewer
   */
  public multiDocsToggle() {
    this.store.dispatch({ type: UIStoreActions.MULTIDOCS_TOGGLE, payload: null });
    this.resyncUI();
  }

  /**
   * Toggle the loan contacts sidebar
   */
  public loanContactsToggle() {
    this.store.dispatch({ type: UIStoreActions.LOAN_CONTACTS_TOGGLE, payload: null });
  }

  /**
   * Update the value of a form in the store
   * @param formType - Which form to update
   * @param value - New form value
   * @param loanHasUpdate - Should this form change set the loanHasUpdate flag
   */
  public formChange(formType: FormTypes, value: any, loanHasUpdate = false) {
    this.store.dispatch({ type: UIStoreActions.FORM_CHANGE, payload: { formType: formType, value: value, loanHasUpdate: loanHasUpdate } });
  }

  /**  Reload the last UI state from localstorage */
  public rehydrateUI(uiState: any) {
    // console.log('rehydrateUI', uiState);
    this.store.dispatch({ type: UIStoreActions.REHYDRATE, payload: uiState });
  }

  /**
   * Manage multi app communication via postmessage
   */
  private multiAppCommunication() {

    // Listen for any interapp communication on same domain
    this.messaging.listenForMessages([window.location.origin]).subscribe(message => {
      console.log('Message Received', message);
      switch (message.event) {
        case MessageActions.RESYNC_UI:
          if (message.payload) {
            this.rehydrateUI(message.payload);
          } else { // Update UI state from localstorage
            this.rehydrateUI(JSON.parse(window.localStorage.getItem('ui')));
          }
          break;
        case MessageActions.END_MULTISCREEN:
          this.multiScreenToggle(false);
          break;
      }
    });

    // When this window is closed, tell parent to end multiscreen
    window.onbeforeunload = () => {
      if (window.opener){
        this.messaging.postMessageToWindow(window.opener, { event: MessageActions.END_MULTISCREEN, payload: null });
      }
    }
  }

  /**
   * Resync the UI state between multiple instances of the web app
   */
  private resyncUI() {
    if (this.screen) {
      this.messaging.postMessageToWindow(this.screen, { event: MessageActions.RESYNC_UI, payload: null })
    } else if (window.opener) {
      this.messaging.postMessageToWindow(window.opener, { event: MessageActions.RESYNC_UI, payload: null });
    }
  }

}
