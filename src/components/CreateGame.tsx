import React, { SyntheticEvent, useCallback, useRef, useState } from 'react';
import Game from "../types/Game";

interface CreateGameProps {
    onCreate?: (game: Omit<Game, 'id'>) => void;
}

export default function CreateGame({ onCreate }: CreateGameProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleFormOpen = useCallback(() => setIsOpen(true), []);

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

    const homeInput = useRef<HTMLInputElement>(null);
    const awayInput = useRef<HTMLInputElement>(null);

    const handleSubmit = useCallback((event: SyntheticEvent) => {
        event.preventDefault();
        const homeTeam = homeInput.current!.value;
        const awayTeam = awayInput.current!.value;

        if (!homeTeam || !awayTeam) {
            setErrorMessage('Home Team and Away Team fields are required');
            return false;
        }

        if (onCreate) {
            onCreate({ homeTeam, homeScore: 0, awayTeam, awayScore: 0 });
        }

        closeForm();
        return false;
    }, [onCreate, closeForm]);
    
    if (!isOpen) {
      return (
        <div>
          <button onClick={handleFormOpen}>Create Game</button>
        </div>
      );
    }

    return (
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" ref={homeInput} placeholder="Home Team" />
          <input type="text" ref={awayInput} placeholder="Away Team" />
          <button type="submit">Create</button>
          <button onClick={handleCloseForm}>Cancel</button>
        </form>
        {errorMessage && <div>{errorMessage}</div>}
      </div>
    );
}