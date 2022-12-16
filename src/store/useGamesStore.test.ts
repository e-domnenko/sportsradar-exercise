import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Game from "../types/Game";
import useGameStore from "./useGamesStore";

describe("Games Store", () => {
  let now: number;
  let game0: Game;
  let game1: Game;
  let game2: Game;

  beforeAll(() => {
    jest.useFakeTimers();

    now = Date.now();
    game0 = {
      id: 1,
      homeTeam: "Home 1",
      awayTeam: "Away 1",
      createdAt: now - 100,
      homeScore: 3,
      awayScore: 3,
    };
    game1 = {
      id: 2,
      homeTeam: "Home 2",
      awayTeam: "Away 2",
      createdAt: now - 50,
      homeScore: 4,
      awayScore: 3,
    };
    game2 = {
      id: 3,
      homeTeam: "Home 3",
      awayTeam: "Away 3",
      createdAt: now - 10,
      homeScore: 4,
      awayScore: 2,
    };
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("should return empty list", () => {
    const { result } = renderHook(() => useGameStore());

    expect(result.current[0]).toEqual([]);
  });

  test("games should be properly sorted", () => {
    const initialGames = [game0, game1, game2];
    const sortedGames = [game1, game0, game2];

    const { result } = renderHook(() => useGameStore(initialGames));

    expect(result.current[0]).toEqual(sortedGames);
  });

  test("should add game", () => {
    const { result } = renderHook(() => useGameStore());
    const { addGame } = result.current[1];
    const newGame = { homeTeam: "Home", awayTeam: "Away" };

    act(() => addGame(newGame));

    const actual = result.current[0];
    expect(actual).toHaveLength(1);
    expect(actual[0]).toMatchObject({
      ...newGame,
      homeScore: 0,
      awayScore: 0,
      createdAt: now,
    });
    expect(actual[0].id).toBeDefined();
  });

  test("should update score and return sorted list", () => {
    const initialGames = [game0, game1, game2];
    const updatedGame: Game = {
      ...game2,
      homeScore: 4,
      awayScore: 4,
    };
    const sortedGames = [updatedGame, game1, game0];

    const { result } = renderHook(() => useGameStore(initialGames));
    const { updateScore } = result.current[1];

    act(() =>
      updateScore({
        gameId: game2.id,
        homeScore: updatedGame.homeScore,
        awayScore: updatedGame.awayScore,
      })
    );

    expect(result.current[0]).toEqual(sortedGames);
  });

  test('should throw if homeTeam not specified', () => {
    const { result } = renderHook(() => useGameStore());
    const { addGame } = result.current[1];
    const newGame = { homeTeam: "", awayTeam: "Away" };

    expect(() => addGame(newGame)).toThrow(/required/i);
  });

  test('should throw if awayTeam not specified', () => {
    const { result } = renderHook(() => useGameStore());
    const { addGame } = result.current[1];
    const newGame = { homeTeam: "Home", awayTeam: "" };

    expect(() => addGame(newGame)).toThrow(/required/i);
  });

  test('should throw if gameId is NaN', () => {
    const { result } = renderHook(() => useGameStore([game0]));
    const { updateScore } = result.current[1];

    expect(() => updateScore({ gameId: NaN, homeScore: 2, awayScore: 2 })).toThrow(/required/i);
  });

  test('should ignore update if gameId is not found', () => {
    const { result } = renderHook(() => useGameStore([game0]));
    const { updateScore } = result.current[1];

    act(() => updateScore({ gameId: 1000, homeScore: 2, awayScore: 2 }));
    expect(result.current[0]).toEqual([game0])
  });

  test('should throw if homeScore is NaN', () => {
    const { result } = renderHook(() => useGameStore([game0]));
    const { updateScore } = result.current[1];

    expect(() => updateScore({ gameId: game0.id, homeScore: NaN, awayScore: 2 })).toThrow(/required/i);
  });

  test('should throw if homeScore is negative', () => {
    const { result } = renderHook(() => useGameStore([game0]));
    const { updateScore } = result.current[1];

    expect(() => updateScore({ gameId: game0.id, homeScore: -1, awayScore: 2 })).toThrow(/positive integer/i);
  });

  test('should throw if homeScore is fractional', () => {
    const { result } = renderHook(() => useGameStore([game0]));
    const { updateScore } = result.current[1];

    expect(() => updateScore({ gameId: game0.id, homeScore: 1.2, awayScore: 2 })).toThrow(/positive integer/i);
  });

  test('should throw if awayScore is NaN', () => {
    const { result } = renderHook(() => useGameStore([game0]));
    const { updateScore } = result.current[1];

    expect(() => updateScore({ gameId: game0.id, homeScore: 2, awayScore: NaN })).toThrow(/required/i);
  });

  test('should throw if awayScore is negative', () => {
    const { result } = renderHook(() => useGameStore([game0]));
    const { updateScore } = result.current[1];

    expect(() => updateScore({ gameId: game0.id, homeScore: 2, awayScore: -1 })).toThrow(/positive integer/i);
  });

  test('should throw if awayScore is fractional', () => {
    const { result } = renderHook(() => useGameStore([game0]));
    const { updateScore } = result.current[1];

    expect(() => updateScore({ gameId: game0.id, homeScore: 2, awayScore: 1.2 })).toThrow(/positive integer/i);
  });

  test('score update homeScore should accept zero', () => {
    const updatedGame: Game = {
      ...game0,
      homeScore: 0,
    };

    const { result } = renderHook(() => useGameStore([game0]));
    const { updateScore } = result.current[1];

    act(() =>
      updateScore({
        gameId: updatedGame.id,
        homeScore: updatedGame.homeScore,
        awayScore: updatedGame.awayScore,
      })
    );

    expect(result.current[0]).toEqual([updatedGame]);
  });

  test('score update awayScore should accept zero', () => {
    const updatedGame: Game = {
      ...game0,
      awayScore: 0,
    };

    const { result } = renderHook(() => useGameStore([game0]));
    const { updateScore } = result.current[1];

    act(() =>
      updateScore({
        gameId: updatedGame.id,
        homeScore: updatedGame.homeScore,
        awayScore: updatedGame.awayScore,
      })
    );

    expect(result.current[0]).toEqual([updatedGame]);
  });

  test('id should be unique', () => {
    const initialGames = [game0, game1, game2];

    const { result } = renderHook(() => useGameStore(initialGames));

    const { addGame } = result.current[1];
    const newGame = { homeTeam: "Home", awayTeam: "Away" };

    act(() => addGame(newGame));

    const createdId = result.current[0][3].id;
    expect(createdId).not.toEqual(game0.id);
    expect(createdId).not.toEqual(game1.id);
    expect(createdId).not.toEqual(game2.id);
  })
});
