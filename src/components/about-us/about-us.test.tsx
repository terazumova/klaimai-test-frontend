import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import mockFetch from "../../mocks/mockFetch";
import { AboutUs } from "./about-us";

let windowFetchSpy: jest.SpyInstance;

beforeEach(() => {
  windowFetchSpy = jest.spyOn(window, "fetch").mockImplementation(
    jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockFetch("/info")),
      })
    ) as jest.Mock
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders AboutUs component", async () => {
  render(<AboutUs />, { wrapper: BrowserRouter });

  expect(windowFetchSpy).toHaveBeenCalledTimes(1);

  expect(await screen.findByText("test")).toBeInTheDocument();

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    /About us/i
  );
  expect(screen.getByRole("button", { name: /About us/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Sign in/i })).toBeInTheDocument();
});
