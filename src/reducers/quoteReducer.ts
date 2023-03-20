import { QuoteAction, QuoteState } from "../types/types";

export const reducer = (state: QuoteState, action: QuoteAction): QuoteState => {
  switch (action.type) {
    case "CHANGE_FIRST_STEP_TEXT":
      return {
        ...state,
        firstStepText: action.payload,
      };
    case "CHANGE_SECOND_STEP_TEXT":
      return {
        ...state,
        secondStepText: action.payload,
      };
    case "CHANGE_CANCEL_AUTHOR_TOKEN":
      return {
        ...state,
        cancelAuthorToken: action.payload,
      };
    case "CHANGE_CANCEL_QUOTE_TOKEN":
      return {
        ...state,
        cancelQuoteToken: action.payload,
      };
    default:
      return state;
  }
};
