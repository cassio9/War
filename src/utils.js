export function getWinner(cardPC, cardMe) {
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
  if (cardPCIndex > cardMeIndex) {
    return "PC";
  } else if (cardPCIndex < cardMeIndex) {
    return "User";
  } else {
    return "DRAW";
  }
}

// <h1 id="title" className="title">
// {score.computer > score.user && cards.isFinished
//   ? "COMPUTER WON THIS GAME!!!!"
//   : score.computer < score.user && cards.isFinished
//   ? "USER WON THIS GAME!!!!"
//   : score.computer == score.user && cards.isFinished
//   ? "TIE!!!!"
//   : "WAR!"}
// </h1>
