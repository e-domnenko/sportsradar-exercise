import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import CreateGame from './CreateGame';

describe("CreateGame", () => {
  test("create game button is shown", () => {
    render(<CreateGame />);
    const buttonElement = screen.getByText(/Create Game/i, {
      selector: "button",
    });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeEnabled();
  });

  test("create form is shown", () => {
    render(<CreateGame />);
    const buttonElement = screen.getByText(/Create Game/i, {
      selector: "button",
    });
    fireEvent.click(buttonElement);
    expect(buttonElement).not.toBeInTheDocument();

    const homeInput = screen.getByPlaceholderText(/Home Team/i);
    expect(homeInput).toBeInTheDocument();

    const awayInput = screen.getByPlaceholderText(/Away Team/i);
    expect(awayInput).toBeInTheDocument();

    const submitButton = screen.getByText(/create/i, { selector: "button" });
    expect(submitButton).toBeInTheDocument();

    const cancelButton = screen.getByText(/cancel/i, { selector: "button" });
    expect(cancelButton).toBeInTheDocument();
  });

  test("shoud call onCreate after successfull validation", () => {
    const homeTeamName = "Home Team";
    const awayTeamName = "Avay Team";
    const handleCreate = jest.fn();

    render(<CreateGame onCreate={handleCreate} />);
    const buttonElement = screen.getByText(/Create Game/i, {
      selector: "button",
    });
    fireEvent.click(buttonElement);

    const homeInput = screen.getByPlaceholderText(/Home Team/i);
    fireEvent.change(homeInput, { target: { value: homeTeamName } });

    const awayInput = screen.getByPlaceholderText(/Away Team/i);
    fireEvent.change(awayInput, { target: { value: awayTeamName } });

    const submitButton = screen.getByText(/create/i, { selector: "button" });
    fireEvent.click(submitButton);

    expect(handleCreate).toBeCalledWith({
      homeTeam: homeTeamName,
      awayTeam: awayTeamName
    });
  });

  test("shoud hide form if cancel clicked", () => {
    render(<CreateGame />);

    fireEvent.click(
      screen.getByText(/Create Game/i, {
        selector: "button",
      })
    );

    const cancelButton = screen.getByText(/cancel/i, { selector: "button" });
    fireEvent.click(cancelButton);

    expect(cancelButton).not.toBeInTheDocument();
    expect(
      screen.getByText(/Create Game/i, {
        selector: "button",
      })
    ).toBeInTheDocument();
  });

  test("should show error if fields are empty", () => {
    render(<CreateGame />);
    const buttonElement = screen.getByText(/Create Game/i, {
      selector: "button",
    });
    fireEvent.click(buttonElement);

    const submitButton = screen.getByText(/create/i, { selector: "button" });
    fireEvent.click(submitButton);

    const errorMessage = screen.getByText(/fields are required/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
