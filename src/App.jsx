import { useEffect } from "react";
import { useState } from "react";
import "./App.css";

function App() {
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
            remainingCards: data.remaining - 30,
            ComputerCard: data.cards[0].value,
            UserCard: data.cards[1].value,
            isPlaying: true,
          });
        });
    } else {
      console.log("Please, shuffle the deck first");
    }
  }

  useEffect(() => {
    getWinner(cards.ComputerCard, cards.UserCard);
    finishGame(cards.remainingCards, cards.isPlaying);
  }, [cards]);

  function getWinner(cardPC, cardMe) {
    cardPC == "JACK" ? (cardPC = 11) : cardPC;
    cardPC == "QUEEN" ? (cardPC = 12) : cardPC;
    cardPC == "KING" ? (cardPC = 13) : cardPC;
    cardPC == "ACE" ? (cardPC = 1) : cardPC;
    cardMe == "JACK" ? (cardMe = 11) : cardMe;
    cardMe == "QUEEN" ? (cardMe = 12) : cardMe;
    cardMe == "KING" ? (cardMe = 13) : cardMe;
    cardMe == "ACE" ? (cardMe = 1) : cardMe;
    if (Number(cardPC) > Number(cardMe)) {
      setScoreComputer(scoreComputer + 1);
    } else if (Number(cardPC) < Number(cardMe)) {
      setScoreUser(scoreUser + 1);
    }
  }

  function finishGame(remainingCards, isPlaying) {
    if (remainingCards == 0 && isPlaying) {
      setCards({
        isFinished: true,
      });
      document.getElementById("");
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
        <button onClick={newDeck} className="btn shuffle">
          Shuffle Deck
        </button>
        <span className="remaining">
          Remaining cards: {cards.remainingCards || 0}{" "}
        </span>
      </div>
      <h1 className="title">War!</h1>
      <div className="main-container">
        <div className="slot-container">
          <p>Computer: {scoreComputer}</p>
          <div className="card-slot">
            <img src={cards.ComputerCardImg} alt="" />
          </div>
        </div>
        <div className="slot-container">
          <p className="me-paragraph">Me: {scoreUser}</p>
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
      >
        {cards.isFinished ? "GAME FINISHED!! RESTART THE GAME" : "Draw"}
      </button>
    </div>
  );
}

export default App;

// FUNCTIONS
