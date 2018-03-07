import { IStore } from '@shared';
import { UIStoreActions, FormTypes } from './ui.store.actions';

// Define initial store state : State.main
const initialState: IStore.ui = {
  modal: null,
  tabViewer: 1,
  tabForm: 1,
  loan: null,
  vesting: null
};

export function UIStoreReducer(state = initialState, { type, payload }) {
   // console.log('UI REDUCER:', type, payload);

  // Write state to localstorage for persistence
  const saveState = () => {
    window.localStorage.setItem('ui', JSON.stringify(state));
  };

  switch (type) {

    case UIStoreActions.REHYDRATE:
      state = { ...payload };
      saveState();
      break;
    case UIStoreActions.MODAL_OPEN:
      state.modal = { ...payload };
      saveState();
      break;
    case UIStoreActions.MODAL_UNLOAD:
      state.modal = null;
      saveState();
    case UIStoreActions.LOAN_CHANGE:
      state.loan = { ...payload };
      saveState();
    case UIStoreActions.FORM_CHANGE:
      state[payload.formType] = { ...payload.value };
      saveState();
    case UIStoreActions.TAB_CHANGE:
      let tabType: 'viewer' | 'form' = payload.tabType;
      let tabNum: number = payload.tabNum;
      if (tabType == 'viewer') {
        state.tabViewer = tabNum;
      } else if (tabType == 'form') {
        state.tabForm = tabNum;
      }
      saveState();
      break;

  }

  // console.log('UI STATE: ', state);
  return state;
}
