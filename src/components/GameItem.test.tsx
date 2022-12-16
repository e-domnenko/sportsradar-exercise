import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import GameItem from "./GameItem";

describe("GameItem", () => {
  const game = {
    id: 1,
    homeTeam: "Home",
    homeScore: 5,
    awayTeam: "Away",
    awayScore: 3,
    createdAt: Date.now()
  };

  test("game with score is displayed", () => {
    render(<GameItem game={game} />);

    expect(
      screen.getByText(
        `${game.homeTeam} ${game.homeScore} - ${game.awayTeam} ${game.awayScore}`
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(/update score/i, { selector: "button" })
    ).toBeInTheDocument();
  });

  test("update score form is shown", () => {
    render(<GameItem game={game} />);

    const updateButton = screen.getByText(/update score/i, {
      selector: "button",
    });
    fireEvent.click(updateButton);

    expect(updateButton).not.toBeInTheDocument();

    expect(screen.getByLabelText(game.homeTeam)).toBeInTheDocument();
    expect(screen.getByLabelText(game.awayTeam)).toBeInTheDocument();
    expect(
      screen.getByText(/update/i, { selector: "button" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/cancel/i, { selector: "button" })
    ).toBeInTheDocument();
  });

  test("score inputs are filled correctly", () => {
    render(<GameItem game={game} />);

    fireEvent.click(
      screen.getByText(/update score/i, {
        selector: "button",
      })
    );

    expect(screen.getByLabelText(game.homeTeam)).toHaveValue(game.homeScore);
    expect(screen.getByLabelText(game.awayTeam)).toHaveValue(game.awayScore);
  });

  test("update form is closed on cancel", () => {
    render(<GameItem game={game} />);

    fireEvent.click(
      screen.getByText(/update score/i, {
        selector: "button",
      })
    );

    const cancelButton = screen.getByText(/cancel/i, { selector: "button" });
    fireEvent.click(cancelButton);

    expect(cancelButton).not.toBeInTheDocument();
    expect(
      screen.getByText(/update score/i, {
        selector: "button",
      })
    ).toBeInTheDocument();
  });

  test("error message is shown if scores is empty", () => {
    render(<GameItem game={game} />);

    fireEvent.click(
      screen.getByText(/update score/i, {
        selector: "button",
      })
    );

    fireEvent.change(screen.getByLabelText(game.homeTeam), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText(/update/i, { selector: "button" }));
    expect(screen.getByText(/fields are required/i)).toBeInTheDocument();
  });

  test("error message is shown if scores are ivalid", () => {
    render(<GameItem game={game} />);

    fireEvent.click(
      screen.getByText(/update score/i, {
        selector: "button",
      })
    );

    fireEvent.change(screen.getByLabelText(game.homeTeam), {
      target: { value: "-3" },
    });

    fireEvent.click(screen.getByText(/update/i, { selector: "button" }));

    expect(screen.getByText(/fields should be positive integers/i)).toBeInTheDocument();
  });

  test("onScoreChange is called with right update", () => {
    const handleChange = jest.fn();
    const newHomeScore = 3;
    render(<GameItem game={game} onScoreChange={handleChange} />);

    fireEvent.click(
      screen.getByText(/update score/i, {
        selector: "button",
      })
    );

    fireEvent.change(screen.getByLabelText(game.homeTeam), {
      target: { value: newHomeScore.toString() },
    });

    fireEvent.click(screen.getByText(/update/i, { selector: "button" }));

    expect(handleChange).toBeCalledWith({ gameId: game.id, homeScore: newHomeScore, awayScore: game.awayScore });
  })
});
