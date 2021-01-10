import React from "react"
import { Solitaire, getImperfectState, getPerfectState } from "../components/projects/solitaire";
import GameTree, { GameTreeController } from '../components/projects/game-tree'

function Example() {
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

// function Example() {
// 	const deck      = getImperfectState();
// 	const solitaire = new Solitaire(deck.waste, deck.tableaus, deck.foundations, deck.hidden_cards);
//
// 	return (
// 		<div style={{
// 			height          : '100vh',
// 			width           : '100vw',
// 			display         : 'flex',
// 			justifyContent  : 'center',
// 			alignItems      : 'center',
// 			backgroundColor : 'gray',
// 		}}>
// 			<GameTreeController solitaire={solitaire} />
// 		</div>
// 	);
// }

export default Example;