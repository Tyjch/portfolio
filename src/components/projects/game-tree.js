import React, { useRef, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CytoscapeComponent from "react-cytoscapejs/src/component";
import cytoscape from "cytoscape";
import dagre from 'cytoscape-dagre';
import { ReactSolitaire } from "./solitaire";
import styles from '../../styles/projects/game-tree.module.css';

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
			'color'                : 'white',
			'line-color'           : '#434343',
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
];

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
			cy.current.makeLayout({...layout}).run();
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
					return legal_move.card.is_equal(action.card) && (
						legal_move.target_pile.cards.length === 0 || legal_move.target_pile.target.is_equal(action.target_pile.target)
					);
				});
				edge_label = `${action.card.to_string()}→${action.target_pile.target.to_string()}`;
				next_state.applyMove(next_action[0]);
				break;
			}
			case 'chance' : {
				const next_action = next_state.chanceOutcomes().filter(legal_card => {
					console.log('legal_card:', legal_card);
					console.log('action:', action);
					return legal_card.is_equal(action);
				})
				edge_label = `${action.to_string()}`;
				next_state.applyOutcome(next_action[0]);
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
			console.group('doRecursiveStep()');

			const elements_to_add = [];
			const unvisited_nodes = cy.current.nodes(`[step = ${timestep}]`);

			if (unvisited_nodes) {
				console.groupCollapsed('unvisited_nodes');

				unvisited_nodes.forEach(curr_node => {
					const curr_state  = curr_node.data('state');
					let legal_actions = [];

					console.log('curr_state.type:', curr_state.type);

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

					console.group('legal_actions:');
					legal_actions.forEach(action => {
						console.log('action:', action);
						const [next_node, next_edge] = expandNode(curr_node, action);
						elements_to_add.push(next_node);
						elements_to_add.push(next_edge);
					});
					console.groupEnd();
				})

				console.groupEnd();

				setElements([
					...elements,
					...elements_to_add
				]);
				setTimestep(timestep + 1);
			} else {
				console.warn('Attempted to expand unvisited nodes but found none');
			}
			console.groupEnd();
		}
	}

	// ELEMENTS
	const button_element    = (<>
		<button
			className = { styles.button }
			onClick   = { () => handleClick() }
		>
			Step
		</button>
	</>);
	const cytoscape_element = (<>
		<CytoscapeComponent
			className  = { styles.cytoscape }
			cy         = { ref => { cy.current = ref } }
			elements   = { elements }
			layout     = { layout }
			stylesheet = { stylesheet }
		/>
	</>);

	// RENDERER
	return (<>
		<div className={styles.tree}>
			{button_element}
			{cytoscape_element}
		</div>
	</>);
}

function GameTreeController({ solitaire }) {
	const [state, setState] = useState(solitaire);

	function handleNodeClick(event) {
		console.log('handleNodeClick()');
		const new_state = event.target.data('state');
		console.log('new_state:', new_state.to_string());
		setState(new_state);
	}

	let solitaire_element   = (<>
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
			onNodeClick  = {handleNodeClick}
		/>
	</>);

	return (
		<div className={styles.controller}>
			{solitaire_element}
			{game_tree_element}
		</div>
	);
}


export default GameTree;
export { GameTreeController };

