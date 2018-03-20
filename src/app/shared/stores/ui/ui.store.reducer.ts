import { IStore } from '@shared';
import { UIStoreActions, FormTypes } from './ui.store.actions';

/** Which properties of the store properties to NOT persist or save to local storage */
const ignoreProps = ['loanHasUpdate','forms'];

// Define initial store state : State.main
const initialState: IStore.ui = {
  modal: null,
  tabViewer: 1,
  tabForm: 1,
  tabDashboard: 1,
  loanHasUpdate: false,
  multiscreen: false,
  document:null,
  forms: {
    loan: null,
    borrower: {
      borrower: `John Smith
Jane Smith`,
      maritalStatus:'Married'
    },
    vesting: null
  },

};

export function UIStoreReducer(state = initialState, { type, payload }) {
   // console.log('UI REDUCER:', type, payload);

  // Write state to localstorage for persistence
  const saveState = () => {
    let stateNew = { ...state };
    // Delete any keys that should not be persisted
    for (let key in stateNew) {
      if (stateNew.hasOwnProperty(key) && ignoreProps.indexOf(key) != -1 && stateNew[key]) {
        delete stateNew[key];
      }
    }
    // Save UI state to localstorage
    window.localStorage.setItem('ui', JSON.stringify(stateNew));
  };

  switch (type) {

    case UIStoreActions.REHYDRATE:
      state = { ...initialState, ...payload };
      saveState();
      break;
    case UIStoreActions.MODAL_OPEN:
      state.modal = { ...payload };
      saveState();
      break;
    case UIStoreActions.MODAL_UNLOAD:
      state.modal = null;
      saveState();
      break;
    case UIStoreActions.LOAN_SAVED:
      state.loanHasUpdate = false;
      saveState();
      break;
    case UIStoreActions.MULTISCREEN_TOGGLE:
      state.multiscreen = !state.multiscreen;
      saveState();
      break;
    case UIStoreActions.DOC_CHANGE:
      state.document = payload;
      saveState();
      break;
    case UIStoreActions.FORM_CHANGE:
      if (payload.loanHasUpdate){
        state.loanHasUpdate = true;
      }
      state.forms[payload.formType] = { ...payload.value };
      saveState();
      break;
    case UIStoreActions.TAB_CHANGE:
      let tabType: 'viewer' | 'form' | 'dashboard' = payload.tabType;
      let tabNum: number = payload.tabNum;
      if (tabType == 'viewer') {
        state.tabViewer = tabNum;
      } else if (tabType == 'form') {
        state.tabForm = tabNum;
      } else if (tabType == 'dashboard') {
        state.tabDashboard = tabNum;
      }
      saveState();
      break;

  }

  // console.log('UI STATE: ', state);
  return state;
}
