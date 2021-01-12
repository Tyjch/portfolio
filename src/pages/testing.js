import React from "react"
import Solitaire, { getImperfectState, getPerfectState } from "../classes/solitaire";
import GameTree, { GameTreeController } from '../components/projects/game-tree'

function GameTreeExample() {
	const deck      = getPerfectState();
	const solitaire = new Solitaire(deck.waste, deck.tableaus, deck.foundations, deck.hidden_cards);

	return (
		<div style={{
			height          : '100vh',
			display         : 'flex',
			justifyContent  : 'center',
			alignItems      : 'center',
			backgroundColor : 'gray',
		}}>
			<GameTree
				solitaire    = {solitaire}
				is_recursive = {true}
				max_depth    = {100}
			/>
		</div>
	);
}

function TreeControllerExample() {
	const deck      = getImperfectState();
	const solitaire = new Solitaire(deck.waste, deck.tableaus, deck.foundations, deck.hidden_cards);

	return <GameTreeController solitaire={solitaire} />;
}

export default TreeControllerExample;