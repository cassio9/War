import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // Variable to control cards from API
  const [cards, setCards] = useState({
    remainingCards: "",
    ComputerCardImg: "",
    UserCardImg: "",
    ComputerCard: "",
    UserCard: "",
    deckId: "",
    isPlaying: false,
    isFinished: false,
  });

  //Variables to control score
  const [scoreComputer, setScoreComputer] = useState(0);
  const [scoreUser, setScoreUser] = useState(0);

  function newDeck() {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then((res) => res.json())
      .then((data) => setCards({ ...cards, deckId: data.deck_id }));
  }

  function drawCards() {
    if (cards.deckId) {
      fetch(`https://deckofcardsapi.com/api/deck/${cards.deckId}/draw/?count=2`)
        .then((res) => res.json())
        .then((data) => {
          setCards({
            ...cards,
            ComputerCardImg: data.cards[0].image,
            UserCardImg: data.cards[1].image,
            remainingCards: data.remaining - 42,
            ComputerCard: data.cards[0].value,
            UserCard: data.cards[1].value,
            isPlaying: true,
          });
        });
    } else {
      document.getElementById("draw-btn").innerText = "First, shuffle the deck";
      setTimeout(() => {
        document.getElementById("draw-btn").innerText = "DRAW";
      }, 1000);
    }
  }

  useEffect(() => {
    getWinner(cards.ComputerCard, cards.UserCard);
    finishGame(cards.remainingCards, cards.isPlaying);
  }, [cards.remainingCards]);

  function getWinner(cardPC, cardMe) {
    const valueOptions = [
      "ACE",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "JACK",
      "QUEEN",
      "KING",
    ];
    const cardPCIndex = valueOptions.indexOf(cardPC);
    const cardMeIndex = valueOptions.indexOf(cardMe);
    console.log(cardPCIndex, cardMeIndex);
    if (cardPCIndex > cardMeIndex) {
      setScoreComputer(scoreComputer + 1);
    } else if (cardPCIndex < cardMeIndex) {
      setScoreUser(scoreUser + 1);
    }
  }

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
    setScoreComputer(0);
    setScoreUser(0);
  }

  return (
    <div className="App">
      <div>
        <button
          onClick={cards.isFinished ? resetGame : newDeck}
          className="btn shuffle"
        >
          Shuffle Deck
        </button>
        <span className="remaining">
          Remaining cards: {cards.remainingCards || 0}{" "}
        </span>
      </div>
      <h1 id="title" className="title">
        {scoreComputer > scoreUser && cards.isFinished
          ? "COMPUTER WON THIS GAME!!!!"
          : scoreComputer < scoreUser && cards.isFinished
          ? "USER WON THIS GAME!!!!"
          : scoreComputer == scoreUser && cards.isFinished
          ? "TIE!!!!"
          : "WAR!"}
      </h1>
      <div className="main-container">
        <div className="slot-container">
          <p>Computer: {scoreComputer}</p>
          <div className="card-slot">
            <img src={cards.ComputerCardImg} alt="" />
          </div>
        </div>
        <div className="slot-container">
          <p className="me-paragraph">User: {scoreUser}</p>
          <div className="card-slot">
            <img src={cards.UserCardImg} alt="" />
          </div>
        </div>
      </div>
      {!cards.deckId && (
        <p className="startWarning">First, Shuffle the deck </p>
      )}
      <button
        onClick={cards.isFinished ? resetGame : drawCards}
        className="btn draw"
        id="draw-btn"
      >
        {cards.isFinished ? "RESTART" : "Draw"}
      </button>
    </div>
  );
}

export default App;

// FUNCTIONS
