import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import mockFetch from "../../../mocks/mockFetch";
import { QuoteModal } from "./quote-modal";

beforeEach(() => {
  Object.defineProperty(window.document, "cookie", {
    writable: true,
    value: "token=token",
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders Profile component", async () => {
  const testProps = {
    isQuoteModalVisible: true,
    setIsQuoteModalVisible: jest.fn(),
    onQuoteFetched: jest.fn(),
  };

  render(<QuoteModal {...testProps} />, { wrapper: BrowserRouter });

  expect(screen.getByText(/Requesting the quote/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
});

test("fetches author data", async () => {
  const xhrMockAuthor: Partial<XMLHttpRequest> = {
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    onload: () => JSON.stringify(mockFetch("/author")),
    responseText: JSON.stringify(mockFetch("/author")),
  };

  const xhrMockQuote: Partial<XMLHttpRequest> = {
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    responseText: JSON.stringify(mockFetch("/quote")),
  };

  const mockFn = jest.spyOn(window, "XMLHttpRequest");
  mockFn
    .mockImplementationOnce(() => xhrMockAuthor as XMLHttpRequest)
    .mockImplementationOnce(() => xhrMockQuote as XMLHttpRequest);

  const testProps = {
    isQuoteModalVisible: true,
    setIsQuoteModalVisible: jest.fn(),
    onQuoteFetched: jest.fn(),
  };

  render(<QuoteModal {...testProps} />, { wrapper: BrowserRouter });

  (xhrMockAuthor.onload as EventListener)(new Event(""));

  await waitFor(() => {
    expect(
      screen.getByText(/Step 1: Requesting author..Completed./i)
    ).toBeInTheDocument();
  });

  (xhrMockQuote.onload as EventListener)(new Event(""));

  await waitFor(() => {
    expect(
      screen.getByText(/Step 2: Requesting quote..Completed./i)
    ).toBeInTheDocument();
  });
});
