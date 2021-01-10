import React, { useRef, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CytoscapeComponent from "react-cytoscapejs/src/component";
import cytoscape from "cytoscape";
import dagre from 'cytoscape-dagre';
import styles from '../../styles/projects/game-tree.module.css';

cytoscape.use(dagre);

class RandomAgent {
	choose_action(legal_actions) {
		return random_choice(legal_actions);
	}
}

function random_choice(array) {
	return array[Math.floor(Math.random() * array.length)];
}
function split(array) {
	const half_index = Math.ceil(array.length / 2);
	return {
		first : array.splice(0, half_index),
		last  : array.splice(-half_index),
	}
}

const NODE_COLORS = {
	player   : 'blue',
	chance   : 'orange',
	terminal : 'red',
	root     : 'white',
};
const NODE_SHAPES = {
	player    : 'ellipse',
	chance    : 'round-diamond',
	terminal  : 'round-triangle',
	unvisited : 'hexagon',
};
const stylesheet  = [
	{
		selector : 'node',
		style : {
			'label'            : '',
			'shape'            : 'data(shape)',
			'padding'          : '10px',
		}
	},
	{
		selector : 'edge',
		style : {
			"label"        : "data(label)",
			"curve-style"  : "unbundled-bezier",
			"opacity"      : 1.0,
			"line-color"   : "#5d5d5d",
			"text-outline-color" : "#fff",
			"text-outline-width" : 1,
			"target-arrow-shape" : "triangle",
		}
	},

	{
		selector : '.node',
		style : {
			'text-valign'        : 'center',
			'text-halign'        : 'center',
			"text-outline-color" : "#fff",
			"text-outline-width" : 2,
			'width'  : '50px',
			'height' : '50px'
		}
	},
	{
		selector : '.player',
		style : {
			'background-color' : NODE_COLORS.player
		}
	},
	{
		selector : '.chance',
		style : {
			'background-color' : NODE_COLORS.chance
		}
	},
	{
		selector : '.terminal',
		style : {
			'background-color' : NODE_COLORS.terminal
		}
	},
	{
		selector : '.root',
		style : {
			'background-color' : NODE_COLORS.player,
			'shape' : 'star',
		}
	},
	{
		selector : '.unvisited_node',
		style : {
			'shape'              : 'ellipse',
			'background-color'   : 'red',
			'background-opacity' : 0.2,
			'width'  : '2px',
			'height' : '2px'
		}
	},
	{
		selector : '.visited_edge',
		style : {
			'line-color'         : 'red',
			'target-arrow-color' : 'red',
		}
	},
	{
		selector : '.unvisited_edge',
		style : {
			'width'           : '1px',
			//'line-opacity'    : 0.5,
			'label'           : '',

			'curve-style'            : 'bezier',
			'taxi-direction'         : 'downward',
			'taxi-turn'              : '-40%',
			'taxi-turn-min-distance' : '5px',
			'edge-distances'         : 'node-position',

			'target-endpoint'      : 'outside-to-line-or-label',
			'target-label'         : 'data(label)',
			'target-text-offset'   : 30,
			// 'target-text-margin-y' : 20,
		},
	}
];

function GameTree_old({ solitaire, speed, agent_object, is_recursive, max_depth }) {

	// REFS
	const agent = useRef(agent_object);
	let   game  = useRef(solitaire);
	let   cy    = useRef();

	// CONSTANTS
	const will_recurse = is_recursive;
	const initial_elements = [{
		classes : ['node', 'root', 'visited_node', solitaire.type],
		data : {
			id      : `node-root`,
			label   : solitaire.type,
			shape   : 'star',
			step    : 0,
			returns : 0.0, // TODO: Replace with
			rewards : 0.0,
		}
	}];
	const layout = {
		name    : 'dagre',
		animate : true,
		fit     : true,

		nodeSep    : 50,
		edgeSep    : 20,
		rankSep    : 200,
		rankDir    : 'TB',
		ranker     : 'network-simplex',
		minLen     : function(edge) { return edge.classes().includes('unvisited_edge') ? 0.2 : 0.4 },
		edgeWeight : function(edge) { return edge.classes().includes('unvisited_edge') ? 1 : 1 },

		padding                     : 30,
		spacingFactor               : 1,
		nodeDimensionsIncludeLabels : true,

		animationDuration           : 500,
		animationEasing             : undefined,
		boundingBox                 : undefined,
		ready                       : function() {},
		stop                        : function() {

		},
		// animateFilter               : function(node, i) { return timestep === node.data().step },
		transform                   : function(node,pos) {
			if (cy.current) {
				const last_node = cy.current.getElementById(lastNode.data.id);
				const classes = node.classes();

				if (classes.includes('visited_node')) {
					// Centers the visited node on the x-coordinate of the last visited node while maintaining its y-coordinate
					return {...last_node.point(), y: pos.y};
				} else if (classes.includes('unvisited_node') /*&& node.data().step === timestep*/) {
					if (node.data().step === timestep) {
						// Moves y to the midpoint between current position & parent position, shift x over a set amount to the right
						return {
							x: last_node.point().x, // + 200,
							y: last_node.point().y
						}
					} else {

					}
				}

			}
			return pos;
		},
	}

	// STATES
	const [lastNode, setLastNode] = useState(initial_elements[0]);
	const [elements, setElements] = useState(initial_elements);
	const [timestep, setTimestep] = useState(0);
	const [isRunning, setRunning] = useState(true);
	const [isDone, setDone]       = useState(false);

	// METHODS
	function doLinearStep() {
		let default_x = 0;
		let default_y = 0;

		if (cy.current) {
			// If cytoscape ref is valid, set the default position for nodes to the bottom
			const { x1, y1, x2, y2, w, h } = cy.current.extent();
			default_x = (x2 - x1) / 2;
			default_y = y2 + 100;
		}

		if (!isDone) {
			const prev_node = lastNode;
			let edge_label  = '';

			let unvisited_nodes = [];
			let unvisited_edges = [];

			switch (game.current.type) {
				case 'player'   : {
					// Generate node for chosen action
					const legal_actions = game.current.legalMoves();
					const action = agent.current.choose_action(legal_actions);
					edge_label = `${action.card.to_string()}→${action.target_pile.target.to_string()}`;

					// Generate nodes & edges for unvisited actions
					const unvisited_actions = legal_actions.filter(move => {
						return !(action.card.is_equal(move.card) &&
							action.target_pile.target.is_equal(move.target_pile.target))
					});
					unvisited_actions.forEach(move => {
						const unvisited_node = {
							classes  : ['node', 'unvisited_node'],
							position : { x: default_x, y: default_y },
							data     : {
								id      : `node-${uuidv4()}`,
								label   : '',
								shape   : NODE_SHAPES.unvisited,
								step    : timestep + 1,
								returns : 0.0,
								rewards : 0.0,
							}
						}
						const unvisited_edge = {
							classes : ['edge', 'unvisited_edge'],
							data : {
								id     : `edge-${uuidv4()}`,
								label  : `${move.card.to_string()}→${move.target_pile.target.to_string()}`,
								source : prev_node.data.id,
								target : unvisited_node.data.id,
								step   : timestep + 1,
							}
						};
						unvisited_nodes.push(unvisited_node);
						unvisited_edges.push(unvisited_edge);
					});

					// Apply the chosen move to change the state
					game.current.applyMove(action);
					break;
				}
				case 'chance'   : {
					// Generate node for the chosen outcome
					const legal_actions = game.current.chanceOutcomes();
					const action = agent.current.choose_action(legal_actions);
					edge_label = `${action.to_string()}`;

					// Generate nodes & edges for unvisited outcomes
					const unvisited_actions = legal_actions.filter(card => !card.is_equal(action));
					unvisited_actions.forEach(card => {
						const unvisited_node = {
							classes  : ['node', 'unvisited_node'],
							position : { x: default_x, y: default_y },
							data     : {
								id      : `node-${uuidv4()}`,
								label   : '',
								shape   : NODE_SHAPES.unvisited,
								step    : timestep + 1,
								returns : 0.0,
								rewards : 0.0,
							}
						}
						const unvisited_edge = {
							classes : ['edge', 'unvisited_edge'],
							data : {
								id     : `edge-${uuidv4()}`,
								label  : `${card.to_string()}`,
								source : prev_node.data.id,
								target : unvisited_node.data.id,
								step   : timestep + 1,
							}
						};
						unvisited_nodes.push(unvisited_node);
						unvisited_edges.push(unvisited_edge);
					})

					// Apply the chosen outcome to change the state
					game.current.applyOutcome(action);
					break;
				}
				case 'terminal' : {
					// TODO: Not sure if this is necessary, but on terminal nodes, it still shows next moves
					unvisited_nodes = [];
					unvisited_edges = [];
					break;
				}
				default : {
					break;
				}
			}

			const curr_node = {
				classes  : ['node', 'visited_node', solitaire.type],
				position : { x: default_x, y: default_y },
				data     : {
					id      : `node-${uuidv4()}`,
					label   : game.current.type,
					shape   : NODE_SHAPES[game.current.type],
					step    : timestep + 1,
					returns : 0.0,
					rewards : 0.0,
				}
			};
			const curr_edge = {
				classes : ['edge', 'visited_edge'],
				data : {
					id     : `edge-${uuidv4()}`,
					label  : edge_label,
					source : prev_node.data.id,
					target : curr_node.data.id,
					step   : timestep + 1,
				}
			};

			setElements([
				...elements,
				curr_node,
				curr_edge,
				...unvisited_nodes,
				...unvisited_edges,
			])

			setTimestep(timestep + 1);
			setLastNode(curr_node);
		}
	}

	// EVENT HANDLERS
	function handleClick() {
		doLinearStep();
	}
	function handleLayoutStop() {
		if (cy.current) {
			const latest_nodes = cy.current.nodes().filter(element =>
				element.classes().includes('visited_node') && (element.data().step >= timestep - 2)
			);
			latest_nodes.layout(layout).run();
			cy.current.animate({
				fit    : { eles : latest_nodes, padding : 200 },
				zoom   : { level : 1 },
				center : { eles : latest_nodes },
			})
		}
	}

	// EFFECTS
	useEffect(() => {
		// If `isDone` is `true`, we use this to prevent further moves from being made
		if (game.current.type === 'terminal') {
			setDone(true);
		}

		// If the reference to cytoscape is defined, layout the nodes and fit to the view
		if (typeof(cy.current) !== 'undefined') {
			const new_layout = cy.current.makeLayout({...layout,
				fit  : false,
				stop : () => handleLayoutStop(),
			});
			new_layout.run();
		}
	}, [elements])


	return (
		<div
			style = {{
				display        : 'flex',
				justifyContent : 'center',
				alignItems     : 'center',
				width          : '100vw',
				height         : '100vh',
			}}
		>
			<button
				style   = {{ margin : '10px' }}
				onClick = {() => handleClick()}
			>
				Step
			</button>
			<CytoscapeComponent
				cy         = {(cyRef) => { cy.current = cyRef }}
				elements   = {elements}
				stylesheet = {stylesheet}
				layout     = {layout}
				style      = {{ width : '80vw', height : '80vh', border : 'thin solid white' }}
				boxSelectionEnabled    = {false}
				// userPanningEnabled  = {false}
				// userZoomingEnabled  = {false}
				// zoomingEnabled      = {false}
			/>
		</div>
	);
}






export { RandomAgent };
export default GameTree_old;
