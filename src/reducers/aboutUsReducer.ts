import { AboutUsAction, AboutUsState } from "../types/types";

export const reducer = (
  state: AboutUsState,
  action: AboutUsAction
): AboutUsState => {
  switch (action.type) {
    case "CHANGE_DESCRIPTION":
      return {
        ...state,
        description: action.payload,
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
