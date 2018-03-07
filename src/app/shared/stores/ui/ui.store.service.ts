import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IStore } from '@shared';
import { UIStoreActions, FormTypes } from './ui.store.actions';

@Injectable()
export class UIStoreService {

  public modal$ = this.store.select(store => store.ui.modal);
  public tabViewer$ = this.store.select(store => store.ui.tabViewer);
  public tabForm$ = this.store.select(store => store.ui.tabForm);

  public loan$ = this.store.select(store => store.ui.loan);
  public formVesting$ = this.store.select(store => store.ui.vesting);

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
   * Change the active visible tab
   * @param tabType
   * @param tabNum
   */
  public loanChange(loan: any) {
    this.store.dispatch({ type: UIStoreActions.LOAN_CHANGE, payload: loan });
  }

  /**
   * Update the value of a form in the store
   * @param formType
   * @param value
   */
  public formChange(formType: FormTypes, value: any) {
    this.store.dispatch({ type: UIStoreActions.FORM_CHANGE, payload: { formType: formType, value: value } });
  }

  /**  Reload the last UI state from localstorage */
  public rehydrateUI = (uiState: any) => {
    this.store.dispatch({ type: UIStoreActions.REHYDRATE, payload: uiState });
  }


}
