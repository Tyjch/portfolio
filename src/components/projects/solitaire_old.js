import React, { useState, useRef, forwardRef } from 'react'
import { motion } from 'framer-motion'
import styles from '../../styles/projects/solitaire.module.css'

const RED    = '#A20000';
const BLACK  = '#a2a2a2';

const colors = new Map([
	['s', BLACK],
	['h', RED],
	['c', BLACK],
	['d', RED],
	[undefined, 'blue'],
	[null, 'green']
])
const glyphs = new Map([
	['s', '♠'],
	['h', '♥'],
	['c', '♣'],
	['d', '♦'],
	[undefined, 'H'],
	[null, '']
])
const suits  = new Map([
	['♠', 's'],
	['♥', 'h'],
	['♣', 'c'],
	['♦', 'd'],
])

function containsPoint(element, x, y) {
	// Returns `true` if the point (x,y) is within the bounding box of `element`
	const bb = element.getBoundingClientRect();
	return bb.left <= x && x <= bb.right && bb.top <= y && y <= bb.bottom;
}

function Card({ rank, suit }) {
	return (
		<motion.div
			className = {styles.card}
			style     = {{ color : colors.get(suit) }}
		>
			{rank}{glyphs.get(suit)}
		</motion.div>
	)
}

function Pile({ cards, handleDragStart, handleDragEnd}) {
	const [rank, suit] = cards[0];
	const nextCards    = cards.length >= 1 ? cards.slice(1) : [];

	//console.log(`%c Pile String: ${cards.toString()}`, 'color: #ff0000');

	return (
		<motion.div
			className       = {styles.pile}
			drag            = {true}
			dragElastic     = {true}
			dragMomentum    = {false}
			dragConstraints = {{ top:0, bottom:0, left:0, right:0 }}
			onDragStart     = {(event, info) => handleDragStart(event, info)}
			onDragEnd       = {(event, info) => handleDragEnd(event, info)}
		>
			<Card rank={rank} suit={suit} />
			{
				nextCards.length > 0 ? (
					<Pile
						cards           = {nextCards}
						handleDragStart = {handleDragStart}
						handleDragEnd   = {handleDragEnd}
					/>
				) : null
			}
		</motion.div>
	)

}

const Waste = forwardRef(({ cards, handleDragStart, handleDragEnd }, ref) => (
	<motion.div className={styles.waste} ref={ref}>
		{
			cards.map(card => (
				<Pile
					cards           = {[card]}
					handleDragStart = {handleDragStart}
					handleDragEnd   = {handleDragEnd}
				/>
			))
		}
	</motion.div>
))

const Foundation = forwardRef(({ cards, handleDragStart, handleDragEnd }, ref) => (
		<motion.div classname={styles.foundation} ref={ref}>
			{ cards && (
				<Pile
					cards           = {cards}
					handleDragStart = {handleDragStart}
					handleDragEnd   = {handleDragEnd}
				/>
			)}
		</motion.div>
))

const Tableau = forwardRef(({ cards, handleDragStart, handleDragEnd, index}, ref) => (
	<motion.div className={styles.tableau} ref={ref}>
		{ cards && (
			<Pile
				cards           = {cards}
				handleDragStart = {handleDragStart}
				handleDragEnd   = {handleDragEnd}
			/>
		)}
	</motion.div>
))


function Solitaire_old({ layout }) {

	// STATE
	const [waste,       setWaste]       = useState(layout.waste);
	const [foundations, setFoundations] = useState(layout.foundations);
	const [tableaus,    setTableaus]    = useState(layout.tableaus);

	// REFS
	const waste_ref       = useRef();
	const foundations_ref = useRef();
	const tableaus_ref    = useRef();

	const foundation_refs = [useRef(), useRef(), useRef(), useRef()];
	const tableau_refs    = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

	const sourceCard = useRef(null);
	const sourcePath = useRef(null);

	// METHODS
	function getPath(x, y) {
		// Given a point (x, y), get a path to its location
		// e.g. {type: 'tableau', index:0} means the state is in `tableaus[0]` and the ref is in `tableau_refs[0]`
		if (containsPoint(foundations_ref.current, x, y)) {
			for (const [index, foundation] of foundation_refs.entries()) {
				if (containsPoint(foundation.current, x, y)) {
					return {type: 'foundation', index: index};
				}
			}
		}
		else if (containsPoint(tableaus_ref.current, x, y)) {
			for (const [index, tableau] of tableau_refs.entries()) {
				if (containsPoint(tableau.current, x, y)) {
					return {type: 'tableau', index: index};
				}
			}
		}
		else if (containsPoint(waste_ref.current, x, y)) {
			return {type: 'waste', index: 0};
		}
		else {
			return {type: 'none', index: 0};
		}
	}
	function getCards(path) {
		switch (path.type) {
			case 'tableau'    : {
				return tableaus[path.index];
			}
			case 'foundation' : {
				return foundations[path.index];
			}
			case 'waste'      : {
				return waste;
			}
			default           : {
				return []
			}
		}
	}
	function getCardData(cardHtml) {
		if (cardHtml.length === 2) {
			return [cardHtml[0], suits.get(cardHtml[1])];
		} else {
			console.error('cardHtml is not the right length');
			return [null, null];
		}
	}
	function moveCards(source_card, source_path, target_path) {
		const source_pile = getCards(source_path);
		const target_pile = getCards(target_path);

		// const [source_rank, source_suit] = source_card;
		const source_index = source_pile.findIndex(card => {
			return card[0] === source_card[0] && card[1] === source_card[1]
		});

		const transfer_cards  = source_pile.slice(source_index);
		const new_source_pile = source_pile.slice(0, source_index);
		const new_target_pile = [...target_pile, ...transfer_cards];

		updateState(target_path, new_target_pile);
		updateState(source_path, new_source_pile);

		// console.group('MoveCards:');
		// console.dir(source_card);
		// console.log('Source:', source_pile);
		// console.log('Target:', target_pile);
		// console.log('Source Index:', source_index);
		// console.log('Transfer Cards:', transfer_cards);
		// console.log('New Source Pile:', new_source_pile);
		// console.log('New Target Pile:', new_target_pile);
		// console.groupEnd();
	}
	function updateState(path, value) {
		console.group('updateState');

		switch (path.type) {
			case 'foundation' : {
				let state_copy = foundations.slice();
				state_copy[path.index] = value;
				setFoundations(state_copy);
				console.log('x:', state_copy);
				break;
			}
			case 'tableau' : {
				let state_copy = tableaus.slice();
				state_copy[path.index] = value;
				setTableaus(state_copy);
				console.log('x:', state_copy);
				break;
			}
			case 'waste' : {
				let state_copy = waste.slice()
				setWaste(state_copy);
				console.log('x:', waste);
				break;
			}
			default : {
				console.error('Did not update state in `updateState`')
			}
		}

		console.log('path:', path)
		console.log('value:', value)
		console.groupEnd();
	}

	// EVENT HANDLERS
	function handleDragStart(event, info) {
		const { x, y }     = info.point;
		const path         = getPath(x, y);
		const container    = getCards(path);
		const cardString   = event.srcElement.innerHTML;
		sourceCard.current = getCardData(cardString);
		sourcePath.current = path;
	}
	function handleDragEnd(event, info) {
		const { x, y }   = info.point;
		const targetPath = getPath(x, y);
		moveCards(sourceCard.current, sourcePath.current, targetPath);
	}

	// ELEMENTS
	let wasteDiv       = (<>
		WASTE
		<Waste
			cards           = {waste}
			handleDragStart = {handleDragStart}
			handleDragEnd   = {handleDragEnd}
			ref             = {waste_ref}
		/>
	</>);
	let foundationsDiv = (<>
		FOUNDATIONS
		<motion.div className={styles.foundations} ref={foundations_ref}>
			{
				foundations.map((foundation, index) => (
					<Foundation
						cards           = {foundation}
						handleDragStart = {handleDragStart}
						handleDragEnd   = {handleDragEnd}
						ref             = {foundation_refs[index]}
					/>
				))
			}
		</motion.div>
	</>);
	let tableausDiv    = (<>
		TABLEAUS
		<motion.div className={styles.tableaus} ref={tableaus_ref}>
			{
				tableaus.map((tableau, index) => (
					<Tableau
						cards           = {tableau}
						handleDragStart = {handleDragStart}
						handleDragEnd   = {handleDragEnd}
						ref             = {tableau_refs[index]}
					/>
				))
			}
		</motion.div>
	</>);

	// RENDERER
	return (
		<motion.div className={styles.board}>
			{wasteDiv}
			{foundationsDiv}
			{tableausDiv}
		</motion.div>
	);

}




function SolitaireExample() {
	const example_layout = {
		waste       : [
			["2", "c"],
			["3", "c"],
			["4", "c"]
		],
		foundations : [
			[[null, null]],
			[[null, null]],
			[[null, null]],
			[[null, null]]
		],
		tableaus    : [
			[["Q", "h"]],
			[
				[null, null],
				["2", "c"]
			],
			[
				[null, null],
				[null, null],
				["5", "d"]
			],
			[
				[null, null],
				[null, null],
				[null, null],
				["8", "h"]
			],
			[
				[null, null],
				[null, null],
				[null, null],
				[null, null],
				["3", "d"]
			],
			[
				[null, null],
				[null, null],
				[null, null],
				[null, null],
				[null, null],
				["7", "c"]
			],
			[
				[null, null],
				[null, null],
				[null, null],
				[null, null],
				["6", "d"],
				["5", "s"],
				["4", "h"]
			]
		]
	};

	// Examples
	const card_render = (<>
		<Card rank={'K'} suit={'s'} />
		<Card rank={'Q'} suit={'h'} />
		<Card rank={null} suit={null} />
		<Card />
	</>)
	const pile_render = (<>
		<Pile cards={example_layout.waste} />
	</>)

	return (
		<div>
			Solitaire Example
			<Solitaire_old layout={example_layout} />
		</div>
	)
}
export default SolitaireExample;
