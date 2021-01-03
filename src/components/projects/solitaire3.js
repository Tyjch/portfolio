import React, {useCallback, useRef} from 'react'
import {AnimateSharedLayout, motion} from 'framer-motion'
import styles from '../../styles/projects/solitaire.module.css'

// Unicode: ♠ ♥ ♣ ♦ □ →
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
const PILES_SET = new Set(PILES);
// endregion
// region UTILITY
function useForceUpdate() {
	const [, forceUpdate] = React.useState();

	return React.useCallback(() => {
		forceUpdate(s => !s);
	}, []);
}
// endregion
// region TESTS
function test_reveal(pileClass, cards, revealCard) {
	const pile = new pileClass(cards);
	pile.reveal(revealCard);

	console.groupCollapsed('test_reveal()');
	console.log('cards:', cards);
	console.log('pile.cards:', pile.cards);
	console.groupEnd();
}
function test_extend(pileClass, cards, extension) {
	const pile = new pileClass(cards);

	console.groupCollapsed('test_extend()');
	pile.extend(extension);
	console.log('cards:', cards);
	console.log('pile.cards:', pile.cards);
	console.groupEnd();
}
function test_split(pileClass, cards, splitter) {
	const pile = new pileClass(cards);
	const split_card = pile.split(splitter);

	console.groupCollapsed('test_split()');
	console.log('cards:', cards);
	console.log('pile.cards:', pile.cards);
	console.log('split card:', split_card);
	console.groupEnd();
}

function test_sources(pileClass, cards) {
	const pile = new pileClass(cards);

	console.groupCollapsed('test_sources()');
	console.log('pile.cards:', pile.cards);
	console.log('pile.sources:', pile.sources);
	console.groupEnd();
}
function test_target(pileClass, cards) {
	const pile = new pileClass(cards);

	console.groupCollapsed('test_target()');
	console.log('pile.cards:', pile.cards);
	console.log('pile.target:', pile.target);
	console.groupEnd();
}
function test_legal_children(pileClass, cards) {
	const pile = new pileClass(cards);

	console.groupCollapsed('test_legal_children()');
	console.log('pile.cards:', pile.cards);
	console.log('pile.legalChildren:', pile.legalChildren);
	console.groupEnd();
}

function test_solitaire() {
	const waste = new Waste([
		new Card('A', 's'),
		new Card('2', 's'),
		new Card('3', 's'),
	]);
	const tableaus = [
		new Tableau([new Card('K', 's')]),
		new Tableau([new Card(), new Card('Q', 'h')]),
		new Tableau([new Card(), new Card(), new Card('J', 's')]),
		new Tableau([new Card(), new Card(), new Card(), new Card('T', 'h')]),
		new Tableau([new Card(), new Card(), new Card(), new Card(), new Card('9', 'c')]),
		new Tableau([new Card(), new Card(), new Card(), new Card(), new Card(), new Card('T', 'd')]),
		new Tableau([new Card(), new Card(), new Card(), new Card(), new Card('9', 's'), new Card('8', 'h'), new Card('7', 's')]),
	];
	const foundations = [
		new Foundation([], 's'),
		new Foundation([], 'h'),
		new Foundation([], 'c'),
		new Foundation([], 'd')
	];
	const hidden_cards = [
		new Card('2', 'c'),
		new Card('3', 'c'),
		new Card('4', 'c'),
		new Card('5', 'c'),
		new Card('6', 'c'),
		new Card('7', 'c')
	];

	const solitaire = new Solitaire(waste, tableaus, foundations, hidden_cards);

	console.group('TEST: Solitaire');
	solitaire.log();
	console.log('legalMoves:', solitaire.legalMoves());
	const move = solitaire.legalMoves()[0];
	solitaire.applyMove(move);
	solitaire.log();
	console.groupEnd();
}



function run_tests() {

	console.log('TEST: Waste');
	test_reveal(Waste, [
		new Card('A', 's'),
		new Card('K', 's'),
		new Card(),
	], new Card('5', 'h'));
	test_extend(Waste, [
		new Card('A', 's'),
		new Card('K', 's'),
	], [new Card('5', 'h')]);
	test_split(Waste, [
		new Card('A', 's'),
		new Card('K', 's'),
	], new Card('A', 's'));
	test_sources(Waste, [
		new Card('A', 's'),
		new Card('2', 's'),
		new Card('3', 's'),
		new Card('A', 'h'),
		new Card('2', 'h'),
		new Card('3', 'h'),
		new Card('A', 'c'),
		new Card('2', 'c'),
		new Card('3', 'c')
	])
	test_target(Waste, [
		new Card('A', 's'),
		new Card('2', 's'),
		new Card('3', 's'),
		new Card('A', 'h'),
		new Card('2', 'h'),
		new Card('3', 'h'),
		new Card('A', 'c'),
		new Card('2', 'c'),
		new Card('3', 'c')
	])
	test_legal_children(Waste, [
		new Card('A', 's'),
		new Card('2', 's'),
		new Card('3', 's'),
		new Card('A', 'h'),
		new Card('2', 'h'),
		new Card('3', 'h'),
		new Card('A', 'c'),
		new Card('2', 'c'),
		new Card('3', 'c')
	])

	console.log('TEST: Tableau');
	test_reveal(Tableau, [
		new Card(),
		new Card(),
		new Card(),
	], new Card('5', 'h'));
	test_extend(Tableau, [
		new Card(),
		new Card(),
		new Card('K', 's'),
		new Card('Q', 'h'),
	], [
		new Card('J', 's'),
		new Card('T', 'h'),
	]);
	test_split(Tableau, [
		new Card(),
		new Card(),
		new Card('K', 's'),
		new Card('Q', 'h'),
		new Card('J', 's'),
		new Card('T', 'h'),
	], new Card('J', 's'));
	test_sources(Tableau, [
		new Card(),
		new Card(),
		new Card('K', 's'),
		new Card('Q', 'h'),
		new Card('J', 's'),
		new Card('T', 'h'),
	])
	test_target(Tableau, [
		new Card(),
		new Card(),
		new Card('K', 's'),
		new Card('Q', 'h'),
		new Card('J', 's'),
		new Card('T', 'h'),
	])
	test_legal_children(Tableau, [
		new Card(),
		new Card(),
		new Card('K', 's'),
		new Card('Q', 'h'),
		new Card('J', 's'),
		new Card('T', 'h'),
	])

	console.log('TEST: Foundation');
	test_reveal(Foundation, [
		new Card('A', 's'),
		new Card('2', 's'),
		new Card(),
	], new Card('3', 's'));
	test_extend(Foundation, [
		new Card('A', 's'),
		new Card('2', 's'),
	], [
		new Card('3', 's'),
	]);
	test_split(Foundation, [
		new Card('A', 's'),
		new Card('2', 's'),
	], new Card('2', 's'));
	test_sources(Foundation, [
		new Card('A', 's'),
		new Card('2', 's'),
	])
	test_target(Foundation, [
		new Card('A', 's'),
		new Card('2', 's'),
	])
	test_legal_children(Foundation, [
		new Card('A', 's'),
		new Card('2', 's'),
	])

}
// endregion


class Card {

	constructor(rank='', suit='') {
		// TODO: Should `hidden` be true or false by default? Or should it even be included as a parameter?
		if (RANKS_SET.has(rank) && SUITS_SET.has(suit)) {
			this.rank   = rank;
			this.suit   = suit;
		} else {
			throw 'Invalid arguments passed to `Card` constructor';
		}
	}
	is_equal(other_card) {
		return this.rank === other_card.rank && this.suit === other_card.suit && this.hidden === other_card.hidden;
	}
	to_string() {
		if (this.suit !== '') {
			if (this.rank !== '') {
				return `${this.rank}${GLYPHS.get(this.suit)}`;
			} else {
				return `${GLYPHS.get(this.suit)}`;
			}
		} else {
			return '□'
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
		// TODO: Should this be a property or should it not be dependent on rank and suit?
		return this.rank === '' && this.suit === '';
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
	constructor(cards) {
		super(cards);
	}

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
		// TODO: Find a way to do this in one step, partitioning based on a condition
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
	constructor(cards) {
		super(cards);
	}

	reveal(card) {
		const length = this.cards.length;
		if (length >= 1 && this.cards[length - 1].hidden) {
			this.cards[length - 1].rank = card.rank;
			this.cards[length - 1].suit = card.suit;
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
			throw 'Foundation.extend() : `cards` must have a length of 1';
		}
	}
	split(card) {
		if (this.cards.length >= 1) {
			if (card.is_equal(this.cards[this.cards.length - 1])) {
				return [this.cards.pop()];
			} else {
				throw 'Foundation.split() : `card` is not equal to last card';
			}
		} else {
			throw 'Foundation.split() : No cards to split';
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
			return SUITS.slice(1).map(suit => new Card('A', suit));
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

	legalMoves() {
		let legal_moves = [];
		for (let target_pile of [...this.tableaus, ...this.foundations]) {
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
		return legal_moves;
	}
	applyMove(move) {
		// TODO: Ensure that move is legal first
		let {card, source_pile, target_pile} = move;
		target_pile.extend(source_pile.split(card));
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
}

function ReactCard({card}) {
	return (
		<motion.div
			className = {styles.card}
			style     = {{ color : card.color === 'red' ? '#ff0000' : '#ffffff' }}
			layoutId  = {card.rank.concat(card.suit)}
		>
			{card.to_string()}
		</motion.div>
	)
}

function ReactSolitaire({solitaire}) {
	const forceUpdate = useForceUpdate();
	const ref = useRef(solitaire);

	const handleMove = useCallback(move => {
		ref.current.applyMove(move);
		forceUpdate();
	}, [forceUpdate])

	const waste_element       = (<>
		<motion.div className={styles.waste}>
			WASTE
			{ ref.current.waste.cards.map((card, i) => <ReactCard card={card} key={i} /> )}
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
					<motion.div className={styles.tableau} key={i}>
						{ tableau.cards.map((card, j) => <ReactCard card={card} key={j} />) }
					</motion.div>
				))
			}
		</motion.div>
	</>);
	const legal_moves_element = (<>
		<motion.div className={styles.actions}>
			{
				ref.current.legalMoves().map((move, index) => (
					<motion.div
						className  = {styles.action}
						whileHover = {{ scale : 1.10 }}
						whileTap   = {{ scale : 0.85 }}
						onClick    = {() => handleMove(move)}
						key        = {index}
					>
						Action
					</motion.div>
				))
			}
		</motion.div>
	</>)
	return (
		<AnimateSharedLayout>
			<motion.div className={styles.board}>
				{waste_element}
				{foundations_element}
				{tableaus_element}
				{legal_moves_element}
			</motion.div>
		</AnimateSharedLayout>
	)
}

export default function SolitaireExample() {
	test_solitaire();

	const waste = new Waste([
		new Card('A', 's'),
		new Card('2', 's'),
		new Card('3', 's'),
	]);
	const tableaus = [
		new Tableau([new Card('K', 's')]),
		new Tableau([new Card(), new Card('Q', 'h')]),
		new Tableau([new Card(), new Card(), new Card('J', 's')]),
		new Tableau([new Card(), new Card(), new Card(), new Card('T', 'h')]),
		new Tableau([new Card(), new Card(), new Card(), new Card(), new Card('9', 'c')]),
		new Tableau([new Card(), new Card(), new Card(), new Card(), new Card(), new Card('T', 'd')]),
		new Tableau([new Card(), new Card(), new Card(), new Card(), new Card('9', 's'), new Card('8', 'h'), new Card('7', 's')]),
	];
	const foundations = [
		new Foundation([], 's'),
		new Foundation([], 'h'),
		new Foundation([], 'c'),
		new Foundation([], 'd')
	];
	const hidden_cards = [
		new Card('2', 'c'),
		new Card('3', 'c'),
		new Card('4', 'c'),
		new Card('5', 'c'),
		new Card('6', 'c'),
		new Card('7', 'c')
	];

	const solitaire = new Solitaire(waste, tableaus, foundations, hidden_cards);

	return (
		<motion.div>
			Solitaire Example
			<ReactSolitaire solitaire={solitaire} />
		</motion.div>
	);
}