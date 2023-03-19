import { Button, Modal } from "antd";
import React, { useEffect, useReducer } from "react";
import { API_URL, STEPS } from "../../../constants";
import { reducer } from "../../../reducers/quoteReducer";
import useToken from "../../../services/token.service";

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

  useEffect(() => {
    if (isQuoteModalVisible) {
      dispatch({ type: "CHANGE_FIRST_STEP_TEXT", payload: "" });
      dispatch({ type: "CHANGE_SECOND_STEP_TEXT", payload: "" });

      fetchQuotes();
    }
  }, [isQuoteModalVisible]);

  const fetchQuotes = (): void => {
    setIsQuoteModalVisible(true);

    const authorUrl = new URL(`${API_URL}/author`);

    authorUrl.searchParams.set("token", token);

    dispatch({ type: "CHANGE_FIRST_STEP_TEXT", payload: STEPS.FIRST_STEP });

    getWithCancel(authorUrl, true).then((data) => {
      const result = JSON.parse(String(data))?.data;
      const quoteUrl = new URL(`${API_URL}/quote`);

      if (!result?.authorId) {
        return;
      }

      const authorName = result?.name ?? "";

      quoteUrl.searchParams.set("token", token);
      quoteUrl.searchParams.set("authorId", result.authorId);

      dispatch({
        type: "CHANGE_FIRST_STEP_TEXT",
        payload: STEPS.FIRST_STEP + STEPS.COMPLETED,
      });
      dispatch({ type: "CHANGE_SECOND_STEP_TEXT", payload: STEPS.SECOND_STEP });

      getWithCancel(quoteUrl, false).then((data) => {
        const result = JSON.parse(String(data))?.data;

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

  const getWithCancel = (url: URL, isAuthorToken: boolean): Promise<string> => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();

    if (isAuthorToken) {
      dispatch({
        type: "CHANGE_CANCEL_AUTHOR_TOKEN",
        payload: {
          cancel: function () {
            xhr.abort();
          },
        },
      });
    } else {
      dispatch({
        type: "CHANGE_CANCEL_QUOTE_TOKEN",
        payload: {
          cancel: function () {
            xhr.abort();
          },
        },
      });
    }

    return new Promise(function (resolve, reject) {
      xhr.onload = function () {
        resolve(xhr.responseText);
      };
      xhr.onerror = reject;
      xhr.onabort = function () {
        reject(new Error("Cancelled"));
      };
    });
  };

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
