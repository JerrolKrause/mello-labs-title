import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IStore } from '@shared';
import { UIStoreActions, FormTypes } from './ui.store.actions';


import { PostMessageService } from 'src/app/shared/services/post-message.service';
import { AppCommsService } from 'src/app/shared/services/app-comms.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
    private route: ActivatedRoute
  ) {
    // Rehydrate UI state from localstorage
    if (window.localStorage.getItem('ui')) {
      this.rehydrateUI(JSON.parse(window.localStorage.getItem('ui')));
    }
   
    // this.store.subscribe(store => console.log(JSON.parse(JSON.stringify(store))));
  }
  

  /**
   * Change the active visible tab
   * @param tabType
   * @param tabNum
   */
  public tabChange(tabType: 'dashboard' | 'viewer' | 'form', tabNum: number) {
    this.store.dispatch({ type: UIStoreActions.TAB_CHANGE, payload: { tabType: tabType, tabNum: tabNum } });
  }

  /**
   * Change the currently visible document in the document viewer
   * @param docID - GUID of document
   */
  public docViewerChange(docViewerInstance: 0 | 1, docGuid: string) {
    this.store.dispatch({ type: UIStoreActions.DOC_CHANGE, payload: { instance: docViewerInstance, docGuid: docGuid } });
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
  }

  /**
   * Toggle the split documents viewer
   */
  public multiDocsToggle() {
    this.store.dispatch({ type: UIStoreActions.MULTIDOCS_TOGGLE, payload: null });
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

}
