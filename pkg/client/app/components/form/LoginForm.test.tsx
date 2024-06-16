import type { ReactNode } from "react";
import { vi, test, describe, expect, beforeAll, afterEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { StoreProvider } from "@/app/StoreProvider";
import { LoginForm } from "./LoginForm";

describe("ShortUrlForm", () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <StoreProvider>{children}</StoreProvider>
  );

  const mockFetch = vi.fn();

  beforeAll(() => {
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("render correctly", () => {
    render(<LoginForm />, { wrapper });
    expect(screen.getByText(/Login/)).toBeInTheDocument();
    expect(screen.getByText(/Email/)).toBeInTheDocument();
    expect(screen.getByText(/Password/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/example@test.com/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("***")).toBeInTheDocument();
  });

  test("enter invalid email and submit", async () => {
    render(<LoginForm />, { wrapper });
    const elInput = screen.getByPlaceholderText<HTMLInputElement>(/example@test.com/);

    fireEvent.click(elInput);
    fireEvent.change(elInput, { target: { value: "test@invalidEmail" } });
    expect(elInput.value).toBe("test@invalidEmail");

    const elSubmitBnt = screen.getByText(/Login/);
    fireEvent.click(elSubmitBnt);
    const errorMessage = await screen.findByText(/Invalid email/);
    expect(errorMessage.textContent).toBe("Invalid email");
  });

  test("enter invalid password and submit", async () => {
    render(<LoginForm />, { wrapper });
    const elInput = screen.getByPlaceholderText<HTMLInputElement>("***");

    fireEvent.click(elInput);
    fireEvent.change(elInput, { target: { value: "12345" } });
    expect(elInput.value).toBe("12345");

    const elSubmitBnt = screen.getByText(/Login/);
    fireEvent.click(elSubmitBnt);
    const errorMessage = await screen.findByText(/String must contain at least 6 character/);
    expect(errorMessage.textContent).toBe("String must contain at least 6 character(s)");
  });

  test("Submit valid email and password", async () => {
    render(<LoginForm />, { wrapper });
    const elEmail = screen.getByPlaceholderText<HTMLInputElement>(/example@test.com/);
    const elPassword = screen.getByPlaceholderText<HTMLInputElement>("***");

    fireEvent.click(elEmail);
    fireEvent.change(elEmail, { target: { value: "test@test.com" } });
    expect(elEmail.value).toBe("test@test.com");

    fireEvent.click(elPassword);
    fireEvent.change(elPassword, { target: { value: "123456" } });
    expect(elPassword.value).toBe("123456");

    const elSubmitBnt = screen.getByText(/Login/);
    fireEvent.click(elSubmitBnt);

    mockFetch.mockResolvedValue({ email: "test@test.com", created_at: new Date(), position: 1 });

    const emailInput = await screen.findByPlaceholderText(/example@test.com/);
    expect(emailInput.textContent).toBe("");

    const passwordInput = await screen.findByPlaceholderText("***");
    expect(passwordInput.textContent).toBe("");
  });
});
