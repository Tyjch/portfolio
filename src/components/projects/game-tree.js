import React, { useRef, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CytoscapeComponent from "react-cytoscapejs/src/component";
import cytoscape from "cytoscape";
import dagre from 'cytoscape-dagre';
import elk from 'cytoscape-elk';
import styles from '../../styles/projects/game-tree.module.css';


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
			// 'border-width'     : '2px',
			// 'border-color'     : 'orange'
		}
	},
	{
		selector : 'edge',
		style : {
			"label"        : "data(label)",
			"curve-style"  : "taxi",
			"opacity"      : 1.0,
			"line-color"   : "#5d5d5d",
			// "line-opacity" : 0.5,  // TODO: For some reason, I get a warning saying it's invalid
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
			'background-color' : NODE_COLORS.player
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
		selector : 'node',
		style : {
			'label'            : '',
			'shape'            : 'data(shape)',
			'padding'          : '10px',
			// 'border-width'     : '2px',
			// 'border-color'     : 'orange'
		}
	},
];

const breadth_layout = {
	name     : 'breadthfirst',
	directed : true,
	maximal  : true,
	animate  : true,
};
const dagre_layout   = {
	name    : 'dagre',
	animate : true,
	fit     : false,
	align   : 'U',

	nodeSep    : undefined,
	edgeSep    : 130,
	rankSep    : 50,
	rankDir    : undefined,
	ranker     : 'longest-path',
	minLen     : function(edge) { return edge.classes().includes('unvisited_edge') ? 0.2 : 1.0 },
	edgeWeight : function(edge) { return edge.classes().includes('unvisited_edge') ? 0.2 : 5.0 },

	padding                     : 30,
	spacingFactor               : undefined,
	nodeDimensionsIncludeLabels : false,
	animateFilter               : function(node, i) { return true; },
	animationDuration           : 500,
	animationEasing             : undefined,
	boundingBox                 : undefined,
	transform                   : function(node,pos) { return pos; },
	ready                       : function() {},
	stop                        : function() {},
}
const elk_layout     = {
	name : 'elk',
	nodeDimensionsIncludeLabels : false,                                   // Boolean which changes whether label dimensions are included when calculating node dimensions
	fit                         : true,                                    // Whether to fit
	padding                     : 20,                                      // Padding on fit
	animate                     : true,                                    // Whether to transition the node positions
	animateFilter               : function( node, i ){ return true; },     // Whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
	animationDuration           : 500,                                     // Duration of animation in ms if enabled
	animationEasing             : undefined,                               // Easing of animation if enabled
	transform                   : function( node, pos ){ return pos; },    // A function that applies a transform to the final node position
	priority                    : function( edge ){ return null; },        // Edges with a non-nil value are skipped when geedy edge cycle breaking is enabled
	ready                       : undefined,                               // Callback on layoutready
	stop                        : undefined,                               // Callback on layoutstop
	elk : {
		algorithm : 'layered',
		animate   : true,
		nodeNode  : 80,



		// 'layered.crossingMinimization.strategy' : 'INTERACTIVE',
		// 'layered.crossingMinimization.hierarchicalSweepiness' : 0.5,
		// 'layered.crossingMinimization.semiInteractive' : true,
		// 'GreedySwitchType' : 'TWO_SIDED',
		// 'edgeLabels.placement' : 'HEAD',
		// 'layered.layering.coffmanGraham.layerBound' : 20,





	}
}

// algos: layered, mrtree, rectpacking
// All options are available at http://www.eclipse.org/elk/reference.html
// 'org.eclipse.elk.' can be dropped from the Identifier
// Or look at demo.html for an example.
// Enums use the name of the enum e.g.
// 'searchOrder': 'DFS'
//
// The main field to set is `algorithm`, which controls which particular
// layout algorithm is used.

const layout         = elk_layout;

cytoscape.use(elk);

function GameTree({ solitaire, speed, agent_object, is_recursive, max_depth }) {

	const agent = useRef(agent_object);
	let   game  = useRef(solitaire);
	let   cy    = useRef();

	const will_recurse = is_recursive;
	const initial_elements = [{
		classes : ['node', 'root', 'visited_node', solitaire.type],
		data : {
			id      : `node-root`,
			label   : solitaire.type,
			shape   :  'star',
			step    : 0,
			returns : 0.0,
			rewards : 0.0,
		}
	}];

	const [lastNode, setLastNode] = useState(initial_elements[0]);
	const [elements, setElements] = useState(initial_elements);
	const [timestep, setTimestep] = useState(0);
	const [isRunning, setRunning] = useState(true);
	const [isDone, setDone]       = useState(false);

	function doLinearStep() {
		console.groupCollapsed('%cdoLinearStep()', 'color : red');
		if (!isDone) {
			const prev_node = lastNode;
			let edge_label  = '';

			let unvisited_nodes = [];
			let unvisited_edges = [];

			switch (game.current.type) {
				case 'player' : {
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
							classes : ['node', 'unvisited_node'],
							data : {
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
				case 'chance' : {
					// Generate node for the chosen outcome
					const legal_actions = game.current.chanceOutcomes();
					const action = agent.current.choose_action(legal_actions);
					edge_label = `${action.to_string()}`;

					// Generate nodes & edges for unvisited outcomes
					const unvisited_actions = legal_actions.filter(card => !card.is_equal(action));
					unvisited_actions.forEach(card => {
						const unvisited_node = {
							classes : ['node', 'unvisited_node'],
							data : {
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
				default : {
					break;
				}
			}

			const curr_node = {
				classes : ['node', 'visited_node', solitaire.type],
				data : {
					id      : `node-${uuidv4()}`,
					label   : game.current.type,
					shape   : NODE_SHAPES[game.current.type],
					step    : timestep + 1,
					returns : 0.0,
					rewards : 0.0,
				}
			};
			const edge      = {
				classes : ['edge', 'visited_edge'],
				data : {
					id     : `edge-${uuidv4()}`,
					label  : edge_label,
					source : prev_node.data.id,
					target : curr_node.data.id,
					step   : timestep + 1,
				}
			};

			// console.log('visited_node:', curr_node);
			// console.log('visited_edge:', edge);
			// console.log('unvisited_nodes:', unvisited_nodes);
			// console.log('unvisited_edges:', unvisited_edges);

			// We split the unvisited nodes in half so we can place the visited one in the middle
			const node_halves = split(unvisited_nodes);
			const edge_halves = split(unvisited_edges);

			setElements([
				...elements,
				...node_halves.first,
				...edge_halves.first,
				curr_node,
				edge,
				...node_halves.last,
				...edge_halves.last,
			]);
			setTimestep(timestep + 1);
			setLastNode(curr_node);
		}
		console.groupEnd();
	}
	function handleClick() {
		doLinearStep();
	}
	function handleLayoutStop() {
		console.group('handleLayoutStop');
		if (cy.current) {
			const latest_nodes = cy.current.nodes().filter(element =>
				element.classes().includes('visited_node') && (element.data().step >= timestep - 3)
			);

			console.log(latest_nodes.forEach(node => {
				console.group('node:');
				console.log('classes:', node.classes());
				console.log('data:', node.data());
				console.groupEnd();
			}))
			cy.current.animate({
				fit    : { eles : latest_nodes, padding : 200 },
				//zoom   : { level : 1 },
				center : { eles : latest_nodes },
			})

		}
		console.groupEnd();
	}

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
		<div>
			<button onClick={() => handleClick()}> Step </button>
			<CytoscapeComponent
				cy         = {(cyRef) => { cy.current = cyRef }}
				elements   = {elements}
				stylesheet = {stylesheet}
				layout     = {layout}
				style      = {{ width : '90vw', height : '60vh', border : 'thin solid white' }}
				// userPanningEnabled  = {false}
				// userZoomingEnabled  = {false}
				// zoomingEnabled      = {true}
				// boxSelectionEnabled = {false}
			/>
		</div>
	);
}






export { RandomAgent };
export default GameTree;
