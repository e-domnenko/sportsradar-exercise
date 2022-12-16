import { useCallback, useReducer } from "react";
import Game, { GameInit } from "../types/Game";
import ScoreUpdate from "../types/ScoreUpdate";

type AddGame = (game: GameInit) => void;
type UpdateScore = (scoreUpdate: ScoreUpdate) => void;
type UseGameStoreResult = [
  Game[],
  { addGame: AddGame; updateScore: UpdateScore }
];

function compareGames(gameA: Game, gameB: Game) {
  const totalA = gameA.homeScore + gameA.awayScore;
  const totalB = gameB.homeScore + gameB.awayScore;
  const totalDiff = totalB - totalA;

  return totalDiff === 0 ? gameA.createdAt - gameB.createdAt : totalDiff;
}

const ACTION_ADD_GAME = "useGameStore/addGame";
const ACTION_UPDATE_SCORE = "useGameStore/updateScore"

type AddGameAction = { type: typeof ACTION_ADD_GAME; payload: Game };
type UpdateScoreAction = {
  type: typeof ACTION_UPDATE_SCORE;
  payload: ScoreUpdate;
};
type ReducerAction = AddGameAction | UpdateScoreAction;

let currentId = 0;

export default function useGameStore(
  initialGames?: Game[]
): UseGameStoreResult {
  const [games, dispatch] = useReducer(
    (state: Game[], action: ReducerAction) => {
      switch (action.type) {
        case ACTION_ADD_GAME: {
            const newState = [...state, action.payload];
            newState.sort(compareGames);
            return newState;
        }
        case ACTION_UPDATE_SCORE: {
            const scoreUpdate = action.payload as ScoreUpdate;
            const foundGameIdx = state.findIndex((game) => game.id === scoreUpdate.gameId);
            if (foundGameIdx === -1) {
                return state;
            }

            const foundGame = state[foundGameIdx];
            const newState = [
                ...state.slice(0, foundGameIdx),
                ...state.slice(foundGameIdx + 1),
                { ...foundGame, homeScore: scoreUpdate.homeScore, awayScore: scoreUpdate.awayScore }
            ];

            newState.sort(compareGames);
            return newState;
        }
        default:
          return state;
      }
    },
    initialGames || [],
    (initGames: Game[]) => {
      const initialState = [...initGames];
      initGames.forEach(({ id }) => { currentId = Math.max(id, currentId) });
      initialState.sort(compareGames);
      return initialState;
    }
  );

  const addGame = useCallback((game: GameInit) => {
    if (!game.homeTeam || !game.awayTeam) {
      throw new Error("homeTeam and awayTeam fields are required");
    }

    dispatch({
      type: ACTION_ADD_GAME,
      payload: {
        ...game,
        id: ++currentId,
        homeScore: 0,
        awayScore: 0,
        createdAt: Date.now(),
      } as Game,
    });
  }, []);

  const updateScore = useCallback((scoreUpdate: ScoreUpdate) => {
    if (!scoreUpdate.gameId) {
      throw new Error("gameId is required");
    }

    if (isNaN(scoreUpdate.awayScore) || isNaN(scoreUpdate.homeScore)) {
      throw new Error("homeScore and awayScore fields are required");
    }

    if (
      scoreUpdate.homeScore < 0 ||
      Math.floor(scoreUpdate.homeScore) !== scoreUpdate.homeScore ||
      scoreUpdate.awayScore < 0 ||
      Math.floor(scoreUpdate.awayScore) !== scoreUpdate.awayScore
    ) {
      throw new Error(
        "homeScore and awayScore fields must be positive integers"
      );
    }

    dispatch({
      type: ACTION_UPDATE_SCORE,
      payload: scoreUpdate,
    });
  }, []);

  return [games, { addGame, updateScore }];
}
