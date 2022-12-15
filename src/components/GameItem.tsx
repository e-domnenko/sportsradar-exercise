import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useState,
} from "react";
import Game from "../types/Game";
import ScoreUpdate from "../types/ScoreUpdate";

interface GameItemProps {
  game: Game;
  onScoreChange?: (score: ScoreUpdate) => void;
}

export default function GameItem({ game, onScoreChange }: GameItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const homeId = `home-${game.id}`;
  const awayId = `away-${game.id}`;

  const [homeValue, setHomeValue] = useState(game.homeScore.toString());
  const [awayValue, setAwayValue] = useState(game.awayScore.toString());

  const changeHomeScore = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setHomeValue(e.target.value),
    []
  );
  const changeAwayScore = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setAwayValue(e.target.value),
    []
  );

  const handleFormOpen = useCallback(() => {
    setHomeValue(game.homeScore.toString());
    setAwayValue(game.awayScore.toString());
    setIsOpen(true);
  }, [game.awayScore, game.homeScore]);

  const closeForm = useCallback(() => {
    setErrorMessage(null);
    setIsOpen(false);
  }, []);
  const handleCloseForm = useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault();
      closeForm();
      return false;
    },
    [closeForm]
  );

  const handleSubmit = useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault();

      if (!homeValue || !awayValue) {
        setErrorMessage("Score fields are required");
        return false;
      }

      const homeScore = parseInt(homeValue);
      const awayScore = parseInt(awayValue);

      if (
        isNaN(homeScore) ||
        homeScore < 0 ||
        isNaN(awayScore) ||
        awayScore < 0
      ) {
        setErrorMessage("Score fields should be positive integers");
        return false;
      }

      if (onScoreChange) {
        onScoreChange({ gameId: game.id, homeScore, awayScore });
      }

      closeForm();
      return false;
    },
    [homeValue, awayValue, onScoreChange, closeForm, game.id]
  );

  return (
    <div>
      <div>
        <span>
          {game.homeTeam} {game.homeScore} - {game.awayTeam} {game.awayScore}
        </span>
        {!isOpen ? (
          <button onClick={handleFormOpen}>Update Score</button>
        ) : null}
      </div>
      {isOpen ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor={homeId}>{game.homeTeam}</label>
          <input
            type="number"
            id={homeId}
            value={homeValue}
            onChange={changeHomeScore}
          />
          <label htmlFor={awayId}>{game.awayTeam}</label>
          <input
            type="number"
            id={awayId}
            value={awayValue}
            onChange={changeAwayScore}
          />
          <button type="submit">Update</button>
          <button onClick={handleCloseForm}>Cancel</button>
        </form>
      ) : null}
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
}
