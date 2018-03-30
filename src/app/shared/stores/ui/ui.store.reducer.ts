import { IStore } from '@shared';
import { UIStoreActions } from './ui.store.actions';

// Define initial store state : State.main
const initialState: IStore.ui = {
  modal: null,
  tabViewer: 1,
  tabForm: 1,
  tabDashboard: 1,
  loanHasUpdate: false,
  multiscreen: false,
  multiDocs: false,
  loanContacts: false,
  docViewerGuids: [],
  forms: {
    loan: null,
    borrower: {
      borrower: `John Smith
Jane Smith`,
      maritalStatus: 'Married',
    },
    vesting: null,
  },
};

export function UIStoreReducer(state = initialState, { type, payload }: any) {
  // console.log('UI REDUCER:', type, payload, JSON.parse(JSON.stringify(state)));

  switch (type) {
    case UIStoreActions.REHYDRATE:
      state = { ...initialState, ...payload };
      break;
    case UIStoreActions.MODAL_OPEN:
      state.modal = { ...payload };
      break;
    case UIStoreActions.MODAL_UNLOAD:
      state.modal = null;
      break;
    case UIStoreActions.LOAN_SAVED:
      state.loanHasUpdate = false;
      break;
    case UIStoreActions.LOAN_CONTACTS_TOGGLE:
      state.loanContacts = !state.loanContacts;
      break;
    case UIStoreActions.MULTIDOCS_TOGGLE:
      state.multiDocs = !state.multiDocs;
      break;
    case UIStoreActions.MULTISCREEN_TOGGLE:
      state.multiscreen = payload !== null ? payload : !state.multiscreen;
      break;
    case UIStoreActions.DOC_CHANGE:
      state.docViewerGuids[payload.instance] = {
        docGuid: payload.docGuid,
        bounds: payload.bounds,
        pageNumber: payload.pageNumber,
      };
      state.docViewerGuids = [...state.docViewerGuids];
      break;
    case UIStoreActions.FORM_CHANGE:
      if (payload.loanHasUpdate) {
        state.loanHasUpdate = true;
      }
      (<any>state).forms[payload.formType] = { ...payload.value };
      break;
    case UIStoreActions.TAB_CHANGE:
      const tabType: 'viewer' | 'form' | 'dashboard' = payload.tabType;
      const tabNum: number = payload.tabNum;
      if (tabType === 'viewer') {
        state.tabViewer = tabNum;
      } else if (tabType === 'form') {
        state.tabForm = tabNum;
      } else if (tabType === 'dashboard') {
        state.tabDashboard = tabNum;
      }
      break;
  }
  state = { ...state };
  // console.log('UI STATE: ', JSON.parse(JSON.stringify(state)));
  return state;
}
