import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { API_URL, STEPS } from "../../../constants";
import useToken from "../../../services/token.service";

type Token = {
  cancel?: () => void;
};

export const QuoteModal: React.FC<{
  isQuoteModalVisible: boolean;
  setIsQuoteModalVisible: (value: boolean) => void;
  onQuoteFetched: (value: string) => void;
}> = ({ isQuoteModalVisible, setIsQuoteModalVisible, onQuoteFetched }) => {
  const [firstStepText, setFirstStepText] = useState<string>("");
  const [secondStepText, setSecondStepText] = useState<string>("");

  const [cancelAuthorToken, setCancelAuthorToken] = useState<Token>({});
  const [cancelQuoteToken, setCancelQuoteToken] = useState<Token>({});

  const { token } = useToken();

  useEffect(() => {
    if (isQuoteModalVisible) {
      setFirstStepText("");
      setSecondStepText("");

      fetchQuotes();
    }
  }, [isQuoteModalVisible]);

  const fetchQuotes = (): void => {
    setIsQuoteModalVisible(true);

    const authorUrl = new URL(`${API_URL}/author`);

    authorUrl.searchParams.set("token", token);

    setFirstStepText(STEPS.FIRST_STEP);

    getWithCancel(authorUrl, true).then((data) => {
      const result = JSON.parse(String(data))?.data;
      const quoteUrl = new URL(`${API_URL}/quote`);

      if (!result?.authorId) {
        return;
      }

      const authorName = result?.name ?? "";

      quoteUrl.searchParams.set("token", token);
      quoteUrl.searchParams.set("authorId", result.authorId);

      setFirstStepText((firstStepText) => firstStepText + STEPS.COMPLETED);
      setSecondStepText(STEPS.SECOND_STEP);

      getWithCancel(quoteUrl, false).then((data) => {
        const result = JSON.parse(String(data))?.data;

        if (!result?.quote) {
          return;
        }

        setSecondStepText((secondStepText) => secondStepText + STEPS.COMPLETED);
        onQuoteFetched(`${authorName}: ${result.quote}`);
      });
    });
  };

  const getWithCancel = (url: URL, isAuthorToken: boolean): Promise<string> => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();

    if (isAuthorToken) {
      setCancelAuthorToken({
        cancel: function () {
          xhr.abort();
        },
      });
    } else {
      setCancelQuoteToken({
        cancel: function () {
          xhr.abort();
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
    if (cancelAuthorToken?.cancel) {
      cancelAuthorToken.cancel();
    }

    if (cancelQuoteToken?.cancel) {
      cancelQuoteToken.cancel();
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
      <div>{firstStepText}</div>
      <div>{secondStepText}</div>
    </Modal>
  );
};
