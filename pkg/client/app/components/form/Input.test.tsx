import { test, describe, expect } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "./Input";

const defaultProps = {
  id: "testId",
  label: "test label",
};

describe("<Input>", () => {
  test("renders correctly", () => {
    render(<Input {...defaultProps} />);
    expect(() => {
      screen.getByRole("textbox");
      screen.getByText("test label");
    }).not.toThrow();
    const elInput = screen.getByRole("textbox");
    expect(elInput.id).toBe("testId");
    const elLabel = screen.getByText<HTMLLabelElement>("test label");
    expect(elLabel.htmlFor).toBe("testId");
  });

  test('renders correctly errored state', () => {
    render(<Input {...defaultProps} errorMsg="oops" />);

    expect(() => {
      screen.getByRole('textbox');
      screen.getByText('test label');
      screen.getByText('oops');
    }).not.toThrow();
  });

  test("should be able to type in input via click on label", () => {
    render(<Input {...defaultProps} />);
    const elInput = screen.getByRole<HTMLInputElement>("textbox");
    const elLabel = screen.getByText<HTMLLabelElement>("test label");
    fireEvent.click(elLabel);
    fireEvent.change(elInput, { target: { value: "typing test" } });
    expect(elInput.value).toBe("typing test");
  });
});
