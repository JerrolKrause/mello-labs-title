/** Reducer actions for the UI store */
export enum UIStoreActions {
  RESET = 'RESET',
  REHYDRATE = 'REHYDRATE',
  MODAL_OPEN = 'MODAL_OPEN',
  MODAL_UNLOAD = 'MODAL_UNLOAD',
  TAB_CHANGE = 'TAB_CHANGE',
  FORM_CHANGE = 'FORM_CHANGE',
  LOAN_SAVED = 'LOAN_SAVED',
}

export enum FormTypes {
  loan = 'loan',
  info = 'info',
  borrower = 'borrower',
  vesting = 'vesting',
  property = 'property',
  liens = 'liens',
  notes = 'notes',
  certification = 'certification'
}
