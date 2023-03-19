import { Button, Modal } from "antd";
import React, { useEffect, useReducer } from "react";
import { API_URL, STEPS } from "../../../constants";
import { reducer } from "../../../reducers/quoteReducer";
import { getWithCancel } from "../../../services/api.service";
import useToken from "../../../services/token.service";
import { AuthorResponseData, QuoteResponseData } from "../../../types/types";

const initialState = {
  firstStepText: "",
  secondStepText: "",
  cancelAuthorToken: {},
  cancelQuoteToken: {},
};

export const QuoteModal: React.FC<{
  isQuoteModalVisible: boolean;
  setIsQuoteModalVisible: (value: boolean) => void;
  onQuoteFetched: (value: string) => void;
}> = ({ isQuoteModalVisible, setIsQuoteModalVisible, onQuoteFetched }) => {
  const [quoteData, dispatch] = useReducer(reducer, initialState);

  const { token } = useToken();

  const fetchQuotes = (): void => {
    setIsQuoteModalVisible(true);

    const authorUrl = new URL(`${API_URL}/author`);

    authorUrl.searchParams.set("token", token);

    dispatch({ type: "CHANGE_FIRST_STEP_TEXT", payload: STEPS.FIRST_STEP });

    getWithCancel(authorUrl, true, dispatch).then((data) => {
      const { data: result } = JSON.parse(String(data)) as AuthorResponseData;
      const quoteUrl = new URL(`${API_URL}/quote`);

      if (!result?.authorId) {
        return;
      }

      const authorName = result?.name ?? "";

      quoteUrl.searchParams.set("token", token);
      quoteUrl.searchParams.set("authorId", result.authorId.toString());

      dispatch({
        type: "CHANGE_FIRST_STEP_TEXT",
        payload: STEPS.FIRST_STEP + STEPS.COMPLETED,
      });
      dispatch({ type: "CHANGE_SECOND_STEP_TEXT", payload: STEPS.SECOND_STEP });

      getWithCancel(quoteUrl, false, dispatch).then((data) => {
        const { data: result } = JSON.parse(String(data)) as QuoteResponseData;

        if (!result?.quote) {
          return;
        }

        dispatch({
          type: "CHANGE_SECOND_STEP_TEXT",
          payload: STEPS.SECOND_STEP + STEPS.COMPLETED,
        });
        onQuoteFetched(`${authorName}: ${result.quote}`);
      });
    });
  };

  useEffect(() => {
    if (isQuoteModalVisible) {
      dispatch({ type: "CHANGE_FIRST_STEP_TEXT", payload: "" });
      dispatch({ type: "CHANGE_SECOND_STEP_TEXT", payload: "" });

      fetchQuotes();
    }
  }, [isQuoteModalVisible]);

  const onCancelRequests = (): void => {
    if (quoteData.cancelAuthorToken?.cancel) {
      quoteData.cancelAuthorToken.cancel();
    }

    if (quoteData.cancelQuoteToken?.cancel) {
      quoteData.cancelQuoteToken.cancel();
    }

    setIsQuoteModalVisible(false);
  };

  return (
    <Modal
      className="modal"
      title="Requesting the code"
      open={isQuoteModalVisible}
      closable={false}
      onCancel={() => onCancelRequests()}
      width={740}
      footer={[
        <Button
          type="primary"
          className="button"
          onClick={() => onCancelRequests()}
        >
          Cancel
        </Button>,
      ]}
    >
      <div>{quoteData.firstStepText}</div>
      <div>{quoteData.secondStepText}</div>
    </Modal>
  );
};
