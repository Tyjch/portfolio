import React, { useRef, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CytoscapeComponent from "react-cytoscapejs/src/component";
import cytoscape from "cytoscape";
import dagre from 'cytoscape-dagre';
import { ReactSolitaire } from "./solitaire";
import styles from '../../styles/projects/game-tree.module.css';
import {element} from "prop-types";
import {uuid} from "cytoscape/src/util";

// region Other
cytoscape.use(dagre);
class RandomAgent {
	choose_action(legal_actions) {
		return random_choice(legal_actions);
	}
}
function random_choice(array) {
	return array[Math.floor(Math.random() * array.length)];
}
// endregion

const stylesheet = [
	{
		selector : 'node',
		style : {
			// 'width'       : '120px',
			// 'height'      : '55px',
			'shape'       : 'round-rectangle',
			'label'       : '',
			// 'font-size'          : '3',
			'text-valign'        : 'center',
			'text-halign'        : 'center',
			'text-wrap'          : 'wrap',
			'text-justification' : 'left',
		}
	},
	{
		selector : 'edge',
		style : {
			'target-label'         : 'data(label)',
			'target-arrow-shape'   : 'triangle',
			'target-text-margin-y' : -30,
		}
	},

	{
		selector : '.player',
		style : {
			'shape'            : 'ellipse',
			'background-color' : 'blue',
		}
	},
	{
		selector : '.chance',
		style : {
			'shape'            : 'round-diamond',
			'background-color' : 'yellow',
		}
	},
	{
		selector : '.terminal',
		style : {
			'shape'            : 'round-triangle',
			'background-color' : 'red',
		}
	}
]

function GameTree({ solitaire, is_recursive, max_depth, onNodeClick }) {

	// REFS
	const cy   = useRef();

	// CONSTANTS
	const layout = {
		name    : 'dagre',
		animate : true,
		fit     : true,
		rankSep : 200,
		nodeDimensionsIncludeLabels : true,
	}

	// STATES
	const [timestep, setTimestep] = useState(0);
	const [elements, setElements] = useState([{
		classes : ['root', solitaire.type],
		data    : {
			id      : 'node-root',
			label   : solitaire.to_string(),
			step    : 0,
			state   : solitaire,
			visited : false,
		}
	}]);

	// HANDLERS
	function handleClick() {
		doRecursiveStep();
	}

	// EFFECTS
	useEffect(() => {
		if (cy.current) {
			cy.current.makeLayout(layout).run();
		}
	}, [elements]);
	useEffect(() => {
		if (cy.current) {
			cy.current.on('tap', 'node', onNodeClick);
		}
		return () => {cy.current.removeAllListeners()}
	}, []);

	// METHODS
	function expandNode(node, action) {
		let curr_state = node.data('state');
		let next_state = node.data('state').clone();
		let edge_label = '';

		switch (curr_state.type) {
			case 'player' : {
				const next_action = next_state.legalMoves().filter(legal_move => {
					return legal_move.card.is_equal(action.card) &&
						legal_move.target_pile.target.is_equal(action.target_pile.target);
				});
				edge_label = `${action.card.to_string()}→${action.target_pile.target.to_string()}`;
				next_state.applyMove(next_action[0]);
				break;
			}
			case 'chance' : {
				const next_action = next_state.chanceOutcomes().filter(legal_card => {
					return legal_card.is_equal(action);
				})
				edge_label = `${action.to_string()}`;
				next_state.applyOutcome(action);
				break;
			}
			default : {
				break;
			}
		}

		const next_node = {
			classes : ['node', next_state.type],
			data    : {
				id      : `node-${uuidv4()}`,
				label   : next_state.to_string(),
				step    : node.data('step') + 1,
				state   : next_state,
				visited : false,
			}
		};
		const next_edge = {
			classes : ['edge'],
			data    : {
				id     : `edge-${uuidv4()}`,
				label  : edge_label,
				source : node.data('id'),
				target : next_node.data.id,
				step   : node.data('step') + 1,
			}
		};

		return [next_node, next_edge];
	}
	function doRecursiveStep() {
		if (cy.current) {
			const elements_to_add = [];
			const unvisited_nodes = cy.current.nodes(`[step = ${timestep}]`);

			if (unvisited_nodes) {
				unvisited_nodes.forEach(curr_node => {
					const curr_state  = curr_node.data('state');
					let legal_actions = [];

					switch (curr_state.type) {
						case 'player' : {
							legal_actions = curr_state.legalMoves();
							break;
						}
						case 'chance' : {
							legal_actions = curr_state.chanceOutcomes();
							break;
						}
						case 'terminal' : {
							break;
						}
						default : {
							console.error('`curr_state.type` is invalid');
						}
					}

					legal_actions.forEach(action => {
						const [next_node, next_edge] = expandNode(curr_node, action);
						elements_to_add.push(next_node);
						elements_to_add.push(next_edge);
					})
				})

				setElements([
					...elements,
					...elements_to_add
				]);
				setTimestep(timestep + 1);
			} else {
				console.warn('Attempted to expand unvisited nodes but found none');
			}
		}
	}

	// ELEMENTS
	const button_element    = (<>
		<button
			style   = {{ margin : '10px' }}
			onClick = {() => handleClick()}
		>
			Step
		</button>
	</>);
	const cytoscape_element = (<>
		<CytoscapeComponent
			cy         = { ref => { cy.current = ref } }
			elements   = { elements }
			layout     = { layout }
			stylesheet = { stylesheet }
			style      = {{
				minWidth  : '90vw',
				minHeight : '90vh',
				border : 'thin solid white'
			}}
		/>
	</>);

	// RENDERER
	return (<>
		<div style={{
			display        : 'flex',
			flexDirection  : 'column-reverse',
			justifyContent : 'center',
			alignItems     : 'center',
		}}>
			{button_element}
			{cytoscape_element}
		</div>
	</>);

}

function GameTreeController({ solitaire }) {
	const [state, setState] = useState(solitaire);

	const solitaire_element = (<>
		<ReactSolitaire
			solitaire    = {state}
			speed        = {1000}
			autorun      = {false}
			interactive  = {false}
			controllable = {false}
		/>
	</>);
	const game_tree_element = (<>
		<GameTree
			solitaire    = {solitaire}
			is_recursive = {true}
			max_depth    = {100}
			onNodeClick  = {() => console.log('onNodeClick')}
		/>
	</>);

	return (
		<div style={{ display : 'flex', height : '100vh', width : '100vw'}}>
			{solitaire_element}
			{game_tree_element}
		</div>
	);
}


export default GameTree;
export { GameTreeController };