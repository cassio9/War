import { useEffect, useState } from "react";
import "./App.css";

function App() {
	const [deckCards, setDeckCards] = useState("");
	const [score, setScore] = useState({ computer: 0, user: 0 });
	const [cards, setCards] = useState({
		round: 0,
		remainingRounds: 5,
		computerCard: "",
		userCard: "",
		isPlaying: false,
		isFinished: false,
	});

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
			setDeckCards(data);
		}
		getCards();
	}, [cards.isFinished]);

	console.log(deckCards);

	function resetGame() {
		setCards({
			computerCard: "",
			userCard: "",
			round: 0,
			remainingRounds: 5,
			isPlaying: true,
			isFinished: false,
		});
		setScore({ computer: 0, user: 0 });
	}

	function drawCard() {
		if (cards.round < cards.remainingRounds) {
			setCards((prevState) => ({
				...prevState,
				round: prevState.round + 1,
				computerCard: deckCards.cards[`${cards.round}`],
				userCard: deckCards.cards[`${51 - cards.round}`],
			}));
		}
		setTimeout(() => {
			getRoundWinner(
				deckCards.cards[`${cards.round}`].value,
				deckCards.cards[`${51 - cards.round}`].value
			);
			if (cards.round + 1 === cards.remainingRounds) {
				setCards((prevState) => ({
					...prevState,
					isFinished: true,
				}));
			}
		}, 1000);
	}

	function getRoundWinner(cardPC, cardUser) {
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
		const cardMeIndex = valueOptions.indexOf(cardUser);
		if (cardPCIndex > cardMeIndex) {
			setScore((prevState) => ({
				...prevState,
				computer: prevState.computer + 1,
			}));
		} else if (cardPCIndex < cardMeIndex) {
			setScore((prevState) => ({
				...prevState,
				user: prevState.user + 1,
			}));
		}
	}

	return (
		<div className="App">
			{!cards.isPlaying ? (
				<div className="game-start-container">
					<div>
						<h1>WAR</h1>
						<h2>Game Play:</h2>
						<p>
							Each player reveals a card of their deck —this is a "battle"— and the player with the
							higher card win the round.
						</p>
					</div>
					<button
						className="start-game-btn btn"
						onClick={() => setCards((prev) => ({ ...prev, isPlaying: true }))}>
						Start Game
					</button>
				</div>
			) : (
				<div className="main-container">
					<div className="title-container">
						<span className="remaining">
							Round: {cards.round}/{cards.remainingRounds || 0}
						</span>
						<h1 id="title" className={!cards.isFinished ? "title" : "title yellow-title"}>
							{score.computer > score.user && cards.isFinished
								? "PC WON !!"
								: score.computer < score.user && cards.isFinished
								? "USER WON !!"
								: score.computer == score.user && cards.isFinished
								? "TIE!!!!"
								: "WAR!"}
						</h1>
					</div>
					<div className="slot-container">
						<div className="slot-container">
							<p className="scorePC-paragraph ">
								PC: <span style={{ color: "yellow" }}>{score.computer}</span>
							</p>
							<div className="card-slot">
								<img src={cards.computerCard.image} alt="" />
							</div>
						</div>
						<div className="slot-container">
							<p className="score-paragraph order-score">
								User: <span style={{ color: "yellow" }}>{score.user}</span>
							</p>
							<div className="card-slot">
								<img src={cards.userCard.image} alt="" />
							</div>
						</div>
					</div>
					<button
						className={!cards.isFinished ? "btn draw" : "btn draw red"}
						id="draw-btn"
						onClick={cards.isFinished ? resetGame : drawCard}>
						{cards.isFinished ? "RESTART" : "Draw"}
					</button>
				</div>
			)}
		</div>
	);
}

export default App;
