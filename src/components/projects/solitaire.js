import React, { useCallback, useRef, useEffect, useState } from 'react'
import { VscDebugStart, VscDebugStop } from 'react-icons/vsc'
import { AnimateSharedLayout, motion} from 'framer-motion'
import styles from '../../styles/projects/solitaire.module.css'

// region CONSTANTS
const GLYPHS = new Map([
	['s', '♠'],
	['h', '♥'],
	['c', '♣'],
	['d', '♦'],
	['',  '□'],
]);

const RANKS = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
const SUITS = ['', 's', 'h', 'c', 'd'];
const PILES = ['', 'tableau', 'foundation', 'waste'];

const RANKS_SET = new Set(RANKS);
const SUITS_SET = new Set(SUITS);
// endregion
// region UTILITY
function shuffle(array) {
	let currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}
function getOrderedDeck() {
	let deck = [];
	for (const suit of SUITS.slice(1)) {
		for (const rank of RANKS.slice(1)) {
			deck.push(new Card(rank, suit));
		}
	}
	return deck;
}
function getImperfectState() {
	let state = {
		waste        : null,
		foundations  : [],
		tableaus     : [],
		hidden_cards : [],
	};
	let deck  = shuffle(getOrderedDeck());

	// TABLEAUS
	for (let i = 0; i < 7; i++) {
		let tableau_cards = [];
		for (let j = 0; j < i; j++) {
			tableau_cards.push(new Card());
		}
		tableau_cards.push(deck.pop());
		state.tableaus.push(new Tableau(tableau_cards));
	}

	// WASTE
	let waste_cards = [];
	for (let i = 0; i < 24; i++) {
		waste_cards.push(deck.pop());
	}
	state.waste = new Waste(waste_cards);

	// FOUNDATIONS
	for (const suit of SUITS.slice(1)) {
		state.foundations.push(new Foundation([], suit));
	}

	// HIDDEN CARDS
	state.hidden_cards = deck;

	return state;
}
function getPerfectState() {
	let state = {
		waste        : null,
		foundations  : [],
		tableaus     : [],
		hidden_cards : [],
	};
	let deck  = shuffle(getOrderedDeck());

	// TABLEAUS
	for (let i = 0; i < 7; i++) {
		let tableau_cards = [];
		for (let j = 0; j < i; j++) {
			let popped_card = deck.pop();
			popped_card._hidden = true;
			tableau_cards.push(popped_card);
		}
		tableau_cards.push(deck.pop());
		state.tableaus.push(new Tableau(tableau_cards));
	}

	// WASTE
	let waste_cards = [];
	for (let i = 0; i < 24; i++) {
		waste_cards.push(deck.pop());
	}
	state.waste = new Waste(waste_cards);

	// FOUNDATIONS
	for (const suit of SUITS.slice(1)) {
		state.foundations.push(new Foundation([], suit));
	}

	// HIDDEN CARDS
	state.hidden_cards = deck;

	return state;
}
function useForceUpdate() {
	const [, forceUpdate] = React.useState();

	return React.useCallback(() => {
		forceUpdate(s => !s);
	}, []);
}
// endregion

class Card {
	constructor(rank='', suit='', hidden=false) {
		// TODO: Should `hidden` be true or false by default? Or should it even be included as a parameter?
		//  If rank and suit are '', the card should always be hidden
		//  Otherwise, it may be hidden or not, depending on perfect or imperfect information

		// TODO: Reveal card only if it's hidden and rank and suit are both ''

		// Making sure that rank & suit are both valid argument
		if (RANKS_SET.has(rank) && SUITS_SET.has(suit)) {
			this.rank   = rank;
			this.suit   = suit;
		} else {
			throw new Error('Invalid arguments passed to `Card` constructor');
		}

		// If `rank` and `suit` are not '', `_hidden` defaults to `false` but can be
		// over-ridden with `true` in order to represent games of perfect information.
		if (this.rank === '' && this.suit === '') {
			this._hidden = true;
		} else {
			this._hidden = hidden;
		}
	}

	reveal() {
		if (this.rank !== '' && this.suit !== '') {
			this._hidden = false;
		}
	}
	reveal_as(rank, suit) {
		if (this.rank === '' && this.suit === '') {
			this.rank    = rank;
			this.suit    = suit;
			this._hidden = false;
		} else if (this.rank === rank && this.suit === suit) {
			this._hidden = false;
		} else {
			throw new Error('Cannot overwrite rank & suit while revealing a card')
		}
	}
	is_equal(other_card) {
		if (this.hidden || other_card.hidden) {
			return false;
		} else {
			return this.rank === other_card.rank && this.suit === other_card.suit;
		}
	}
	to_string() {
		if (this.suit !== '') {
			if (this.rank !== '') {
				return `${this.rank}${GLYPHS.get(this.suit)}`;
			} else {
				return `${GLYPHS.get(this.suit)}`;
			}
		} else {
			return ''
		}
	}

	get color() {
		if (this.suit === 's' || this.suit === 'c') {
			return 'black';
		} else if (this.suit === 'h' || this.suit === 'd') {
			return 'red';
		} else {
			return 'none';
		}
	}
	get opposite_suits() {
		// None → Array of Strings
		switch (this.color) {
			case 'red' : {
				return ['s', 'c'];
			}
			case 'black' : {
				return ['h', 'd'];
			}
			default : {
				// TODO: What are the opposite suits if `suit === ''`?
				return [];
			}
		}
	}
	get next_rank() {
		// None → String
		if (this.rank === '' || this.rank === 'K') {
			// TODO: What's a good default value if it doesn't have a next rank?
			return '';
		} else {
			const rank_index = RANKS.indexOf(this.rank);
			return RANKS[rank_index + 1];
		}
	}
	get prev_rank() {
		// None → String
		if (this.rank === '' || this.rank === 'A') {
			// TODO: What's a good default value if it doesn't have a next rank?
			return '';
		} else {
			const rank_index = RANKS.indexOf(this.rank);
			return RANKS[rank_index - 1];
		}
	}
	get hidden() {
		if (this.rank === '' && this.suit === '') {
			return true;
		} else {
			return this._hidden;
		}
	}
}

class Pile {
	constructor(cards) {
		this.cards = cards
	}

	reveal(card) {
		// Card → None
		console.warn(`'reveal()' is not implemented`);
	}
	extend(cards) {
		// Array of Cards → None
		console.warn(`'extend()' is not implemented`);
	}
	split(card) {
		// Card → Array of Cards
		console.warn(`'split()' is not implemented`);
		return [];
	}
	to_string() {
		return this.cards.map(card => card.to_string()).toString();
	}

	get size() {
		return this.cards.length;
	}
	get sources() {
		// None → Array of Cards
		console.warn(`'sources()' is not implemented`);
		return [];
	}
	get target() {
		// None → Card
		console.warn(`'targets()' is not implemented`);
		return new Card();
	}
	get legalChildren() {
		// None → Array of Cards
		console.warn(`'legalChildren()' is not implemented`);
		return []
	}
}

class Waste extends Pile {
	reveal(card) {
		// Card → None
		// TODO: What if it can't find a hidden card?
		try {
			const index = this.cards.findIndex(c => c.hidden);
			this.cards[index].rank = card.rank;
			this.cards[index].suit = card.suit;
		} catch (e) {
			console.error('Waste.reveal() : No hidden cards to reveal');
		}
	}
	split(card) {
		// Card → Array of Cards
		const split_cards = this.cards.filter(c => c.rank === card.rank && c.suit === card.suit);
		this.cards = this.cards.filter(c => !(c.rank === card.rank && c.suit === card.suit));
		return split_cards;
	}
	get sources() {
		// None → Array of Cards
		return this.cards.filter((card, index) => !card.hidden && index % 3 === 0);
	}
}

class Tableau extends Pile {
	reveal(card) {
		const length = this.cards.length;
		if (length >= 1 && this.cards[length - 1].hidden) {
			const last_card = this.cards[length - 1];
			if (last_card.rank !== '' && last_card.suit !== '') {
				last_card.reveal();
			} else {
				last_card.reveal_as(card.rank, card.suit);
			}
		}
	}
	extend(cards) {
		// TODO: Make sure the first card is a legal child
		this.cards = [...this.cards, ...cards];
	}
	split(card) {
		const index = this.cards.findIndex(c => c.is_equal(card));
		if (index >= 0 && index <= this.cards.length) {
			const split_cards = this.cards.slice(index);
			this.cards = this.cards.slice(0, index);
			return split_cards;
		} else {
			return [];
		}
	}

	get sources() {
		return this.cards.filter(card => !card.hidden);
	}
	get target() {
		if (this.cards.length >= 1) {
			return this.cards[this.cards.length - 1];
		} else {
			return new Card();
		}
	}
	get legalChildren() {
		if (this.cards.length >= 1) {
			if (this.target.rank === '' || this.target.rank === 'A') {
				return [];
			} else {
				const child_suits = this.target.opposite_suits;
				return child_suits.map(suit => new Card(this.target.prev_rank, suit));
			}
		} else {
			return SUITS.slice(1).map(suit => new Card('K', suit));
		}
	}
}

class Foundation extends Pile {
	constructor(cards, suit='s') {
		super(cards);
		this.suit = suit;
	}

	extend(cards) {
		if (cards.length === 1) {
			this.cards.push(cards[0])
		} else {
			throw new Error('Foundation.extend() : `cards` must have a length of 1');
		}
	}
	split(card) {
		if (this.cards.length >= 1) {
			if (card.is_equal(this.cards[this.cards.length - 1])) {
				return [this.cards.pop()];
			} else {
				throw new Error('Foundation.split() : `card` is not equal to last card');
			}
		} else {
			throw new Error('Foundation.split() : No cards to split');
		}
	}

	get sources() {
		if (this.cards.length >= 1) {
			return [this.cards[this.cards.length - 1]];
		} else {
			return [];
		}
	}
	get target() {
		if (this.cards.length >= 1) {
			return this.cards[this.cards.length - 1];
		} else {
			return new Card('', this.suit);
		}
	}
	get legalChildren() {
		if (this.cards.length >= 1) {
			if (this.target.rank === 'K') {
				return [];
			} else {
				return [new Card(this.target.next_rank, this.suit)];
			}
		} else {
			return [new Card('A', this.suit)];
		}
	}
}

class Solitaire {
	constructor(waste, tableaus, foundations, hidden_cards) {
		this.waste        = waste;
		this.tableaus     = tableaus;
		this.foundations  = foundations;
		this.hidden_cards = hidden_cards;
	}

	// TODO: Maybe store history of moves or at least the previous one?
	// TODO: Identify moves that are reversible & what their reward would be
	legalMoves() {
		// TODO: Foundations can only accept moves from top cards in the tableau
		let legal_moves = [];

		for (let target_pile of this.tableaus) {
			target_pile.legalChildren.forEach(legal_child => {
				for (let source_pile of [this.waste, ...this.tableaus, ...this.foundations]) {
					source_pile.sources.forEach(source => {
						if (source.is_equal(legal_child)) {
							legal_moves.push({
								card        : source,
								source_pile : source_pile,
								target_pile : target_pile,
							})
						}
					})
				}
			})
		}
		for (let target_pile of this.foundations) {
			target_pile.legalChildren.forEach(legal_child => {
				this.waste.sources.forEach(source => {
					if (source.is_equal(legal_child)) {
						legal_moves.push({
							card        : source,
							source_pile : this.waste,
							target_pile : target_pile,
						})
					}
				})
				for (let source_pile of this.tableaus) {
					if (source_pile.size >= 1) {
						const source = source_pile.cards[source_pile.size - 1];
						if (source.is_equal(legal_child)) {
							legal_moves.push({
								card        : source,
								source_pile : source_pile,
								target_pile : target_pile,
							})
						}
					}
				}
			})
		}

		return legal_moves;
	}
	applyMove(move) {
		// TODO: Ensure that move is legal first
		let {card, source_pile, target_pile} = move;
		target_pile.extend(source_pile.split(card));
	}

	chanceOutcomes() {
		// TODO: If the hidden card already has a rank and a suit, that's the only option
		//  Otherwise, any of the hidden cards remaining can be chosen
		for (const tableau of this.tableaus) {
			if (tableau.size >= 1) {
				const last_card = tableau.cards[tableau.size - 1];
				if (last_card.hidden && last_card.rank !== '' && last_card.suit !== '') {
					return [last_card];
				}
			}
		}
		return this.hidden_cards;
	}
	applyOutcome(card) {
		// TODO: Ensure that the move is legal first
		for (let tableau of this.tableaus) {
			if (tableau.size >= 1 && tableau.cards[tableau.size - 1].hidden) {
				tableau.reveal(card);
				this.hidden_cards = this.hidden_cards.filter(hidden_card => !hidden_card.is_equal(card));
			}
		}
	}

	// TODO: Implement scoring function, customizable with some arguments for different kinds of moves
	get reward() {
		return 0.0;
	}
	get returns() {
		return 0.0;
	}

	log() {
		console.group('Solitaire');
		console.group('WASTE:');
		console.log(this.waste.to_string());
		console.groupEnd();

		console.group('FOUNDATIONS:');
		for (const foundation of this.foundations) {
			console.log(foundation.to_string());
		}
		console.groupEnd();

		console.group('TABLEAUS:');
		for (const tableau of this.tableaus) {
			console.log(tableau.to_string());
		}
		console.groupEnd();

		console.groupEnd();
	}
	get type() {
		// None → String ('player', 'chance', or 'terminal')

		// Check if it's a chance node
		for (const tableau of this.tableaus) {
			if (tableau.size >= 1 && tableau.cards[tableau.size - 1].hidden) {
				return 'chance';
			}
		}

		// Check if it's a player node
		if (this.legalMoves().length >= 1) {
			return 'player'
		}

		// If there are no hidden cards to reveal & no legal actions to take, it's terminal
		return 'terminal';
	}
}

function ReactCard({ card }) {

	return (
		<motion.div
			className  = {styles.card}
			layoutId   = {card.hidden ? null : card.rank.concat(card.suit)}
			style      = {{
				color           : card.color === 'red' ? '#ff0000' : '#ffffff',
				borderTopColor  : card.hidden ? 'rgba(23, 23, 23, 0.4)' : 'rgba(23, 23, 23, 0.8)',
			}}
		>
			<motion.div style={{ filter : card.hidden ? 'brightness(25%)' : null }}>
				{card.to_string()}
			</motion.div>
		</motion.div>
	)
}

function ReactSolitaire({ solitaire, speed, autorun, interactive, controllable }) {

	const [isRunning, setRunning] = useState(autorun);
	const forceUpdate = useForceUpdate();
	const ref = useRef(solitaire);

	useEffect(() => {
		if (isRunning) {
			const timer = setInterval(() => {
				if (ref.current.type === 'player') {
					const legal_actions = ref.current.legalMoves();
					const action = legal_actions[Math.floor(Math.random() * legal_actions.length)];
					ref.current.applyMove(action);
					forceUpdate();
				} else if (ref.current.type === 'chance') {
					const legal_actions = ref.current.chanceOutcomes();
					const action = legal_actions[Math.floor(Math.random() * legal_actions.length)];
					ref.current.applyOutcome(action);
					forceUpdate();
				} else {
					console.log('Actions done');
					clearInterval(timer);
				}
			}, speed);
			return () => clearInterval(timer);
		}
	}, [isRunning, forceUpdate])

	const handleMove    = useCallback(move => {
		ref.current.applyMove(move);
		forceUpdate();
	}, [forceUpdate]);
	const handleOutcome = useCallback(card => {
		ref.current.applyOutcome(card);
		forceUpdate();
	}, [forceUpdate]);

	const waste_element       = (<>
		<motion.div className={styles.waste}>
			{ ref.current.waste.cards.map(card => <ReactCard card={card} key={card.to_string()} /> )}
		</motion.div>
	</>);
	const foundations_element = (<>
		<motion.div className={styles.foundations}>
			{
				ref.current.foundations.map((foundation, i) => (
					<motion.div className={styles.foundation} key={i}>
						{ foundation.cards.map((card, j) => <ReactCard card={card} key={j} />) }
					</motion.div>
				))
			}
		</motion.div>
	</>);
	const tableaus_element    = (<>
		<motion.div className={styles.tableaus}>
			{
				ref.current.tableaus.map((tableau, i) => (
					<motion.div
						className  = {styles.tableau}
						key        = {i}
					>
						{ tableau.cards.map((card, j) => <ReactCard card={card} key={j} />) }
					</motion.div>
				))
			}
		</motion.div>
	</>);

	const control_element     = (<>
		<motion.div style = {{ display : 'flex', alignItems : 'center', justifyContent : 'center', padding : '20px' }}>
				{
					isRunning ?
						<VscDebugStop  color={'white'} onClick = { () => isRunning ? setRunning(false) : setRunning(true) } /> :
						<VscDebugStart color={'white'} onClick = { () => isRunning ? setRunning(false) : setRunning(true) } />
				}
		</motion.div>
	</>);
	const actions_element     = (<>
		<motion.div className={styles.actions}>
			{
				ref.current.type === 'player' ?
					ref.current.legalMoves().map((move, index) => (
						<motion.div
							className  = {styles.action}
							whileHover = {{ scale : 1.10 }}
							whileTap   = {{ scale : 0.85 }}
							onClick    = {() => handleMove(move)}
							key        = {index}
						>
							{move.card.to_string()}→{move.target_pile.target.to_string()}
						</motion.div>
					)) : ref.current.chanceOutcomes().map((card, index) => (
						<motion.div
							className  = {styles.action}
							whileHover = {{ scale : 1.10 }}
							whileTap   = {{ scale : 0.85 }}
							onClick    = {() => handleOutcome(card)}
							key        = {index}
						>
							{card.to_string()}
						</motion.div>
					))
			}
		</motion.div>
	</>);
	const board_element       = (<>
		<AnimateSharedLayout>
			<motion.div className={styles.solitaire}>
				{ interactive ? actions_element : null }
				<motion.div className={styles.board}>
					<motion.div style={{ display : 'flex', justifyContent : 'space-between' }}>
						{ controllable ? control_element : null }
						{foundations_element}
					</motion.div>
					{tableaus_element}
				</motion.div>
				{ ref.current.waste.size >= 1 ? waste_element : null }
			</motion.div>
		</AnimateSharedLayout>
	</>);

	return (<>
		{board_element}
	</>);
}

function SolitaireExample() {

	// const waste        = new Waste([
	// 	new Card('A', 's'),
	// 	new Card('2', 's'),
	// 	new Card('3', 's'),
	// 	new Card('A', 'h'),
	// 	new Card('2', 'h'),
	// 	new Card('3', 'h'),
	// 	new Card('A', 'c'),
	// 	new Card('2', 'c'),
	// 	new Card('3', 'c'),
	// 	new Card('A', 'd'),
	// 	new Card('2', 'd'),
	// 	new Card('3', 'd'),
	// ]);
	// const tableaus     = [
	// 	new Tableau([new Card('K', 's')]),
	// 	new Tableau([new Card(), new Card('Q', 'h')]),
	// 	new Tableau([new Card(), new Card(), new Card('J', 's')]),
	// 	new Tableau([new Card(), new Card(), new Card(), new Card('T', 'h')]),
	// 	new Tableau([new Card(), new Card(), new Card(), new Card(), new Card('9', 'c')]),
	// 	new Tableau([new Card(), new Card(), new Card(), new Card(), new Card(), new Card('T', 'd')]),
	// 	new Tableau([new Card(), new Card(), new Card(), new Card(), new Card('9', 's'), new Card('8', 'h'), new Card('7', 's')]),
	// ];
	// const foundations  = [
	// 	new Foundation([], 's'),
	// 	new Foundation([], 'h'),
	// 	new Foundation([], 'c'),
	// 	new Foundation([], 'd')
	// ];
	// const hidden_cards = [
	// 	new Card('5', 's'),
	// 	new Card('6', 's'),
	// 	new Card('7', 's'),
	// 	new Card('5', 'h'),
	// 	new Card('6', 'h'),
	// 	new Card('7', 'h'),
	// 	new Card('5', 'c'),
	// 	new Card('6', 'c'),
	// 	new Card('7', 'c'),
	// 	new Card('5', 'd'),
	// 	new Card('6', 'd'),
	// 	new Card('7', 'd'),
	// ];
	// const perfect_info_tableaus = [
	// 	new Tableau([new Card('K', 's')]),
	// 	new Tableau([new Card('4', 'd', true), new Card('Q', 'h')]),
	// 	new Tableau([new Card('4', 'd', true), new Card('4', 'd', true), new Card('J', 's')]),
	// 	new Tableau([new Card('4', 'd', true), new Card('4', 'd', true), new Card('4', 'd', true), new Card('T', 'h')]),
	// 	new Tableau([new Card('4', 'd', true), new Card('4', 'd', true), new Card('4', 'd', true), new Card('4', 'd', true), new Card('9', 'c')]),
	// 	new Tableau([new Card('4', 'd', true), new Card('4', 'd', true), new Card('4', 'd', true), new Card('4', 'd', true), new Card('4', 'd', true), new Card('T', 'd')]),
	// 	new Tableau([new Card('4', 'd', true), new Card('4', 'd', true), new Card('4', 'd', true), new Card('4', 'd', true), new Card('9', 's'), new Card('8', 'h'), new Card('7', 's')]),
	// ];
	// const solitaire = new Solitaire(waste, tableaus, foundations, hidden_cards);
	// const solitaire = new Solitaire(waste, perfect_info_tableaus, foundations, hidden_cards);

	const deck = getImperfectState();
	//const deck      = getPerfectState();
	const solitaire = new Solitaire(deck.waste, deck.tableaus, deck.foundations, deck.hidden_cards);

	return (
		<motion.div>
			<ReactSolitaire solitaire={solitaire} autorun interactive={false} />
		</motion.div>
	);
}


export default SolitaireExample;
export { ReactSolitaire, ReactCard, Card, Pile, Waste, Tableau, Foundation, Solitaire, getImperfectState, getPerfectState, SUITS, PILES };