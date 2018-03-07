import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IStore } from '@shared';
import { UIStoreActions, FormTypes } from './ui.store.actions';

@Injectable()
export class UIStoreService {

  public modal$ = this.store.select(store => store.ui.modal);
  public tabViewer$ = this.store.select(store => store.ui.tabViewer);
  public tabForm$ = this.store.select(store => store.ui.tabForm);

  public loanHasUpdate$ = this.store.select(store => store.ui.loanHasUpdate);
  public formVesting$ = this.store.select(store => store.ui.forms.vesting);
  public formLoan$ = this.store.select(store => store.ui.forms.loan);

  constructor(
    private store: Store<IStore.root>
  ) {
    if (window.localStorage.getItem('ui')) {
      this.rehydrateUI(JSON.parse(window.localStorage.getItem('ui')));
    }
  }

  /**
   * Change the active visible tab
   * @param tabType
   * @param tabNum
   */
  public tabChange(tabType: 'viewer' | 'form', tabNum:number) {
    this.store.dispatch({ type: UIStoreActions.TAB_CHANGE, payload: { tabType: tabType, tabNum: tabNum} });
  }

  /**
   * Indicate that a loan has been saved and mark the loanHasUpdate flag to false
   */
  public loanSaved() {
    this.store.dispatch({ type: UIStoreActions.LOAN_SAVED, payload: true });
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
  public rehydrateUI = (uiState: any) => {
    this.store.dispatch({ type: UIStoreActions.REHYDRATE, payload: uiState });
  }


}
