import { render, screen } from "@testing-library/react";
import App from "./App";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

test("app rendering/navigating", () => {
  render(<App />, { wrapper: BrowserRouter });

  expect(screen.getAllByText(/About us/i)).toBeTruthy();

  userEvent.click(screen.getByText(/Sign in/i));
  expect(screen.getAllByText(/Sign in/i)).toBeTruthy();
});

test("landing on a bad page", () => {
  const badRoute = "/some/bad/route";

  render(
    <MemoryRouter initialEntries={[badRoute]}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText(/No match/i)).toBeInTheDocument();
});
