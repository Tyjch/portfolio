import React from "react"
import { Solitaire, getImperfectState } from "../components/projects/solitaire";
import GameTree, { RandomAgent } from '../components/projects/game-tree'

function Example() {
	const deck      = getImperfectState();
	const solitaire = new Solitaire(deck.waste, deck.tableaus, deck.foundations, deck.hidden_cards);
	const agent     = new RandomAgent();

	return (
		<div style={{
			backgroundColor : '#343434',
			width           : '100%',
			height          : '100%',
			padding         : '100px',
		}}>
			<GameTree
				solitaire    = {solitaire}
				agent_object = {agent}
				speed        = {1000}
				is_recursive = {false}
			/>
		</div>
	)
}

export default Example;