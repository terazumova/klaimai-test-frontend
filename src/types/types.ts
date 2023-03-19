export type AboutUsState = {
  description: string;
  isMounted: boolean;
};

export type ProfileState = {
  isMounted: boolean;
  isQuoteModalVisible: boolean;
  fullname: string;
  fullQuote: string;
};

export type QuoteState = {
  firstStepText: string;
  secondStepText: string;
  cancelAuthorToken: Token;
  cancelQuoteToken: Token;
};

export type DescriptionAction = { type: "CHANGE_DESCRIPTION"; payload: string };
export type IsMountedAction = { type: "CHANGE_IS_MOUNTED"; payload: boolean };
export type UserNameAction = { type: "CHANGE_USERNAME"; payload: string };
export type FullNameAction = { type: "CHANGE_FULLQUOTE"; payload: string };
export type QuoteModalAction = {
  type: "CHANGE_IS_MODAL_VISIBLE";
  payload: boolean;
};
export type FirstStepAction = {
  type: "CHANGE_FIRST_STEP_TEXT";
  payload: string;
};
export type SecondStepAction = {
  type: "CHANGE_SECOND_STEP_TEXT";
  payload: string;
};
export type CancelAuthorAction = {
  type: "CHANGE_CANCEL_AUTHOR_TOKEN";
  payload: Token;
};
export type CancelQuoteAction = {
  type: "CHANGE_CANCEL_QUOTE_TOKEN";
  payload: Token;
};

export type AboutUsAction = DescriptionAction | IsMountedAction;
export type ProfileAction =
  | UserNameAction
  | FullNameAction
  | QuoteModalAction
  | IsMountedAction;
export type QuoteAction =
  | FirstStepAction
  | SecondStepAction
  | CancelAuthorAction
  | CancelQuoteAction;

export type Token = {
  cancel?: () => void;
};

export type User = {
  email: string;
  password: string;
};

export type InfoResponseData = {
  success: boolean;
  data: {
    info?: string;
    message?: string;
  };
};

export type RegisterResponseData = {
  success: boolean;
  data: {
    message?: string;
  };
};

export type LoginResponseData = {
  success: boolean;
  data: {
    token?: string;
    message?: string;
  };
};

export type ProfileResponseData = {
  success: boolean;
  data: {
    email?: string;
    fullname?: string;
    message?: string;
  };
};

export type AuthorResponseData = {
  success: boolean;
  data: {
    authorId?: number;
    name?: string;
    message?: string;
  };
};

export type QuoteResponseData = {
  success: boolean;
  data: {
    authorId?: number;
    quoteId?: number;
    quote?: string;
    message?: string;
  };
};

export type DeleteResponseData = {
  success: boolean;
  data: {
    message?: string;
  };
};
