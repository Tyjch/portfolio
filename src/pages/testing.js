import React from "react";
import TicTacToeState, { ActionFormatter } from "../classes/games/tictactoe";
import GameController from "../components/projects/game-controller";

function Example() {
	const initial_game = new TicTacToeState();

	return (
		<div style={{
			height          : '100vh',
			display         : 'flex',
			justifyContent  : 'center',
			alignItems      : 'center',
			backgroundColor : 'gray',
		}}>
			<GameController initial_game = {initial_game} />
		</div>
	);
}

export default Example;