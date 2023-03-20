import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import mockFetch from "../../mocks/mockFetch";
import { Login } from "./login";

let windowFetchSpy: jest.SpyInstance;

beforeEach(() => {
  windowFetchSpy = jest.spyOn(window, "fetch").mockImplementation(
    jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockFetch("/login")),
      })
    ) as jest.Mock
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders Login component", async () => {
  render(<Login />, { wrapper: BrowserRouter });

  const emailInput = screen.getByLabelText("Email address") as HTMLInputElement;
  const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;

  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
});

test("should login on submit", async () => {
  render(<Login />, { wrapper: BrowserRouter });

  const emailInput = screen.getByLabelText("Email address") as HTMLInputElement;
  const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;

  fireEvent.change(emailInput, { target: { value: "test@test.te" } });
  fireEvent.change(passwordInput, { target: { value: "password" } });

  await waitFor(() => {
    expect(emailInput.value).toBe("test@test.te");
  });

  await waitFor(() => {
    expect(passwordInput.value).toBe("password");
  });

  fireEvent.submit(screen.getByText("Submit"));

  await waitFor(() => expect(windowFetchSpy).toHaveBeenCalled());
});

test("checks incorrect login input fields", async () => {
  render(<Login />, { wrapper: BrowserRouter });

  const emailInput = screen.getByLabelText("Email address") as HTMLInputElement;
  const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;

  fireEvent.change(emailInput, { target: { value: "test@test.t" } });
  fireEvent.change(passwordInput, { target: { value: "" } });

  fireEvent.click(screen.getByText("Submit"));

  await waitFor(() => {
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText("Please input password")).toBeInTheDocument();
  });
});
