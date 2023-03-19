import { ProfileAction, ProfileState } from "../types/types";

export const reducer = (
  state: ProfileState,
  action: ProfileAction
): ProfileState => {
  switch (action.type) {
    case "CHANGE_USERNAME":
      return {
        ...state,
        fullname: action.payload,
      };
    case "CHANGE_FULLQUOTE":
      return {
        ...state,
        fullQuote: action.payload,
      };
    case "CHANGE_IS_MODAL_VISIBLE":
      return {
        ...state,
        isQuoteModalVisible: action.payload,
      };
    case "CHANGE_IS_MOUNTED":
      return {
        ...state,
        isMounted: action.payload,
      };
    default:
      return state;
  }
};
