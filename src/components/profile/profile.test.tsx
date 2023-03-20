import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import mockFetch from "../../mocks/mockFetch";
import { Profile } from "./profile";

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
  const windowFetchSpy = jest.spyOn(window, "fetch").mockImplementation(
    jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockFetch("/profile")),
      })
    ) as jest.Mock
  );

  render(<Profile />, { wrapper: BrowserRouter });

  expect(screen.getByRole("button", { name: /About us/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Profile/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Sign out/i })).toBeInTheDocument();

  expect(windowFetchSpy).toHaveBeenCalledTimes(1);

  expect(
    await screen.findByRole("button", { name: /Update/i })
  ).toBeInTheDocument();
  expect(await screen.findByText(/Welcome, test/i)).toBeInTheDocument();
  expect(await screen.findByRole("img")).toBeInTheDocument();

  fireEvent.click(await screen.findByRole("button", { name: /Update/i }));

  expect(await screen.findByText(/Requesting the quote/i)).toBeInTheDocument();
});

test("logout on click", async () => {
  render(<Profile />, { wrapper: BrowserRouter });

  fireEvent.click(screen.getByRole("button", { name: /Sign out/i }));

  expect(await screen.findByText(/About us/i)).toBeTruthy();
});
