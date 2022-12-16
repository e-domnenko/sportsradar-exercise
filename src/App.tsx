import useGameStore from "./store/useGamesStore";
import CreateGame from "./components/CreateGame";
import GameItem from "./components/GameItem";
import "./App.css";

function App() {
  const [games, { addGame, updateScore }] = useGameStore();

  return (
    <div className="App">
      <CreateGame onCreate={addGame} />
      <div>
        {games.map((game) => (
          <GameItem key={game.id} game={game} onScoreChange={updateScore} />
        ))}
      </div>
    </div>
  );
}

export default App;
