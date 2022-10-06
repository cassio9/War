import { useEffect, useState } from "react";
import { getWinner } from "./utils.js";
import "./App.css";

function App() {
  const [cards, setCards] = useState({
    round: 0,
    remainingRounds: 5,
    ComputerCardImg: "",
    UserCardImg: "",
    ComputerCard: "",
    UserCard: "",
    deckId: "",
    isPlaying: false,
    isFinished: false,
  });
  const [score, setScore] = useState({ computer: 0, user: 0 });

  useEffect(() => {
    async function getCards() {
      const responseDeckId = await fetch(
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );
      const deckId = await responseDeckId.json();
      const responseCards = await fetch(
        `https://deckofcardsapi.com/api/deck/${deckId.deck_id}/draw/?count=52`
      );
      const data = await responseCards.json();
      setCards((prev) => ({ ...prev, data }));
    }
    getCards();
  }, []);

  useEffect(() => {
    getWinner(cards.ComputerCard, cards.UserCard, setScore);
    finishGame(cards.remainingCards, cards.isPlaying);
  }, [cards.round]);

  function finishGame(remainingCards, isPlaying) {
    if (remainingCards == 0 && isPlaying) {
      setCards({
        ...cards,
        isFinished: true,
        isPlaying: false,
      });
    }
  }

  function resetGame() {
    setCards({
      remainingCards: "",
      ComputerCardImg: "",
      UserCardImg: "",
      ComputerCard: "",
      UserCard: "",
      deckId: "",
      isPlaying: false,
      isFinished: false,
    });
    setScore({ computer: 0, user: 0 });
  }

  console.log(cards);
  function draw() {
    if (cards.round < cards.remainingRounds) {
      setCards((prevState) => ({
        ...prevState,
        round: prevState.round + 1,
        ComputerCardImg: cards.data.cards[`${cards.round}`].image,
        UserCardImg: cards.data.cards[`${51 - cards.round}`].image,
        ComputerCard: cards.data.cards[`${cards.round}`].value,
        UserCard: cards.data.cards[`${51 - cards.round}`].value,
      }));
      updateScore();
    }
  }

  function updateScore() {
    const roundWinner = getWinner(cards.ComputerCard, cards.UserCard);
    if (roundWinner == "PC") {
      setScore((prevState) => ({
        ...prevState,
        computer: prevState.computer + 1,
      }));
    } else if (cardPCIndex < cardMeIndex) {
      setScore((prevState) => ({ ...prevState, computer: prevState.user + 1 }));
    } else {
      console.log("draw");
    }
  }

  return (
    <div className="App">
      <div className="game-container">
        <div>
          <button className="btn shuffle">Start Game</button>
          <span className="remaining">
            Round: {cards.round}/{cards.remainingRounds || 0}
          </span>
        </div>
        <div className="main-container">
          <div className="slot-container">
            <p>PC: {score.computer}</p>
            <div className="card-slot">
              <img src={cards.ComputerCardImg} alt="" />
            </div>
          </div>
          <div className="slot-container">
            <p className="me-paragraph">User: {score.user}</p>
            <div className="card-slot">
              <img src={cards.UserCardImg} alt="" />
            </div>
          </div>
        </div>
        <button className="btn draw" id="draw-btn" onClick={draw}>
          {cards.isFinished ? "RESTART" : "Draw"}
        </button>
      </div>
    </div>
  );
}

export default App;

// FUNCTIONS
