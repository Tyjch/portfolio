import React, {useRef} from 'react'
import {AnimateSharedLayout, motion} from 'framer-motion'
import BiMap from 'mnemonist/bi-map'
import styles from '../../styles/projects/solitaire.module.css'

// TODO: targets should return an array
// TODO: need moves for empty piles (Aces to foundations, kings to tableaus)
// TODO: when moving a card from the waste to tableau, all cards after it are lost somehow
// TODO: can't move aces to foundations


// region CONSTANTS
const BLACK = '#ffffff'
const RED   = '#ff0000'

const Colors     = new Map([
	['s', BLACK],
	['h', RED],
	['c', BLACK],
	['d', RED]
])
const Glyphs     = BiMap.from({
	's' : '♠',
	'h' : '♥',
	'c' : '♣',
	'd' : '♦',
	null : '',
	undefined : '□',
})
const SuitMap    = BiMap.from({
	's' : 0,
	'h' : 1,
	'c' : 2,
	'd' : 3,
})
const RankMap    = BiMap.from({
	'A' : 1,
	'2' : 2,
	'3' : 3,
	'4' : 4,
	'5' : 5,
	'6' : 6,
	'7' : 7,
	'8' : 8,
	'9' : 9,
	'T' : 10,
	'J' : 11,
	'Q' : 12,
	'K' : 13,
});

const BlackSuits = new Set(['s', 'c']);
const RedSuits   = new Set(['h', 'd']);
const AllSuits   = new Set(['s', 'h', 'c', 'd']);
// endregion

// region UTILITY
function isEqual(card, otherCard) {
	return card.rank === otherCard.rank &&
		card.suit   === otherCard.suit &&
		card.hidden === otherCard.hidden;
}
function getOppositeSuits(suit) {
	if (BlackSuits.has(suit)) {
		return RedSuits;
	} else if (RedSuits.has(suit)) {
		return BlackSuits;
	} else {
		return AllSuits;
	}
}
function getString(card) {
	if (typeof(card) === 'undefined') {
		return 'U';
	}

	if (card.suit) {
		if (card.rank) {
			return `${card.rank}${Glyphs.get(card.suit)}`
		} else {
			return `${Glyphs.get(card.suit)}`
		}
	} else {
		return '□'
	}
}
function useForceUpdate() {
	const [, forceUpdate] = React.useState();

	return React.useCallback(() => {
		forceUpdate(s => !s);
	}, []);
}

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
function getDeck() {
	let deck = [];
	for (const suit of SuitMap.keys()) {
		for (const rank of RankMap.keys()) {
			deck.push({rank: rank, suit: suit, hidden: false})
		}
	}
	return deck;
}
function getShuffledDeck() {
	let waste       = [];
	let foundations = [];
	let tableaus    = [];

	let deck = shuffle(getDeck());

	// TABLEAUS
	for (let i = 0; i < 7; i++) {
		let tableau = [];
		for (let j = 0; j < i; j++) {
			tableau.push({rank:null, suit:null, hidden:true})
		}
		tableau.push(deck.pop());
		tableaus.push(tableau);
	}

	// WASTE
	for (let i = 0; i < 24; i++) {
		waste.push(deck.pop());
	}

	// FOUNDATIONS
	for (let i = 0; i < 4; i++) {
		foundations.push([]);
	}

	return {
		waste: waste,
		foundations: foundations,
		tableaus: tableaus,
		hiddenCards: deck,
	}
}
// endregion

// region TEST DATA
const test_moves_to_empty_piles = {
	waste       : [
		{rank: 'A', suit: 's', hidden: false},
		{rank: 'A', suit: 'h', hidden: false},
		{rank: 'K', suit: 'h', hidden: false},
		{rank: 'K', suit: 'c', hidden: false},
		{rank: 'K', suit: 'd', hidden: false}
	],
	foundations : [
		[],
		[],
		[],
		[],
	],
	tableaus    : [
		[
			{rank: 'A', suit: 'c',   hidden: false},
		],
		[
			{rank: null, suit: null, hidden: true},
			{rank: 'A',  suit: 'd',  hidden: false},
		],
		[
			{rank: null, suit: null, hidden: true},
			{rank: 'K',  suit: 's',  hidden: false},
		],
		[
			{rank: null, suit: null, hidden: true},
			{rank: '9', suit: 's',   hidden: false},
			{rank: '8', suit: 'h',   hidden: false},
			{rank: '7', suit: 's',   hidden: false},
		],
		[
			{rank: null, suit: null, hidden: true},
			{rank: '6', suit: 'h',   hidden: false},
			{rank: '5', suit: 'c',   hidden: false}
		],
		[
			{rank: '6', suit: 'd',   hidden: false},
		],
		[],
	],
}
// endregion


class Pile {
	constructor(cards) {
		this.cards = cards
	}
	reveal(card)       {
		console.warn(`'reveal()' is not implemented`);
	}
	extend(cards)      {
		console.warn(`'extend()' is not implemented`);
	}
	split(card)        {
		console.warn(`'split()' is not implemented`);
		return [];
	}

	get sources()       {
		console.warn(`'sources()' is not implemented`);
		return [];
	}
	get target()        {
		console.warn(`'targets()' is not implemented`);
		return undefined;
	}
	get legalChildren() {
		console.warn(`'legalChildren()' is not implemented`);
		return [];
	}
	get lastCard()      {
		if (this.cards.length >= 1) {
			return this.cards.slice(-1)[0];
		}
	}
}

class Waste extends Pile {
	constructor(cards) {
		super(cards);
	}
	reveal(card) {
		const index = this.cards.findIndex(c => c.hidden);
		this.cards[index] = {...card, hidden: false};
	}
	split(card) {
		// TODO: What if the card isn't in `cards`?
		this.cards = this.cards.filter(c => !(c.rank === card.rank && c.suit === card.suit));
		return [card];
	}

	get sources() {
		return this.cards.filter((card, index) => !card.hidden && index % 3 === 0);
	}
}

class Tableau extends Pile {
	constructor(cards) {
		super(cards);
	}
	reveal(card) {
		if (this.lastCard.hidden) {
			this.cards.pop();
			this.cards.push(card);
		}
	}
	extend(cards) {
		// TODO: Make sure the first card is a legal child of this tableau
		this.cards = [...this.cards, ...cards];
	}
	split(card) {
		const index = this.cards.findIndex(c => isEqual(card, c));
		const splitCards = this.cards.slice(index);
		this.cards = this.cards.slice(0, index);
		return splitCards;
	}

	get sources() {
		return this.cards.filter(card => !card.hidden);
	}
	get target() {
		return this.lastCard
	}
	get legalChildren() {
		const legalChildren = [];
		if (this.target) {
			if (this.target.rank === 'A') {
				return legalChildren;
			} else {
				const rankValue = RankMap.get(this.target.rank);
				const childRank = RankMap.inverse.get(rankValue - 1);
				getOppositeSuits(this.target.suit).forEach(childSuit => legalChildren.push({
					rank   : childRank,
					suit   : childSuit,
					hidden : false,
				}))
				return legalChildren;
			}
		} else {
			AllSuits.forEach(childSuit => legalChildren.push({
				rank   : 'K',
				suit   : childSuit,
				hidden : false,
			}));
			return legalChildren;
		}


	}
}

class Foundation extends Pile {
	constructor(suit, cards) {
		super(cards);
		this.suit = suit;
	}
	extend(cards) {
		// TODO: `cards` should be length 1
		// TODO: The only element of `cards` should be a legal child of the foundation
		if (cards.length !== 1) {
			console.error('Foundation.extend() should be passed an array of length 1');
		} else {
			this.cards.push(cards[0]);
		}
	}
	split(card) {
		if (isEqual(card, this.lastCard)) {
			return [this.cards.pop()];
		} else {
			console.error('Foundation.split() cannot return a card that is not a source');
		}
	}

	get lastCard() {
		if (this.cards.length >= 1) {
			return this.cards.slice(-1)[0];
		} else {
			return {rank: null, suit: this.suit, hidden: false}
		}
	}
	get sources() {
		if (this.lastCard) {
			return [this.lastCard];
		} else {
			return [];
		}
	}
	get target() {
		return this.lastCard;
	}
	get legalChildren() {
		if (this.target) {
			if (this.target.rank === 'K') {
				return [];
			} else {
				const rankValue = RankMap.get(this.target.rank);
				const childRank = RankMap.inverse.get(rankValue + 1);
				return [{ rank : childRank, suit : this.suit, hidden : false }];
			}
		} else {
			return [{ rank : 'A', suit : this.suit, hidden : false }];
		}
	}
}

class Solitaire {

	// CONSTRUCTOR
	constructor(waste, tableaus, foundations, hiddenCards) {
		this.waste       = new Waste(waste);
		this.tableaus    = tableaus.map(cards => new Tableau(cards));
		this.foundations = foundations.map((cards, index) => new Foundation(SuitMap.inverse.get(index), cards));
		this.hiddenCards = hiddenCards;
	}

	// FOR PLAYER NODES
	legalPlayerMoves() {
		let legalActions = [];
		if (this.nodeType === 'player') {
			for (let targetPile of [...this.tableaus, ...this.foundations]) {
				targetPile.legalChildren.forEach(legalChild => {
					for (let sourcePile of [this.waste, ...this.tableaus, ...this.foundations]) {
						sourcePile.sources.forEach(source => {
							if (isEqual(source, legalChild)) {
								legalActions.push({
									source: {pile: sourcePile, card: source},
									target: {pile: targetPile, card: targetPile.lastCard}
								});
							}
						})
					}
				})
			}
		}
		console.log('legalActions:', legalActions);
		return legalActions;
	}
	applyPlayerMove(source, target) {
		const action = this.legalPlayerMoves().filter(action => isEqual(source, action.source.card) && isEqual(target, action.target.card))[0];
		action.target.pile.extend(action.source.pile.split(action.source.card))

		// console.group('Action');
		// console.log('action:', action);
		// console.log('source:', action.source);
		// console.log('target:', action.target);
		// console.groupEnd();
		//
		// console.log(this.lastCards())
	}

	// FOR CHANCE NODES
	legalChanceMoves() {
		let legalActions = [];
		if (this.nodeType === 'chance') {
			legalActions = this.hiddenCards;
		}
		return legalActions;
	}
	applyChanceMove(card) {
		const action = this.legalChanceMoves().filter(action => isEqual(action, card))[0];
		for (let tableau of this.tableaus) {
			if (tableau.lastCard.hidden) {
				tableau.reveal(action);
				this.hiddenCards = this.hiddenCards.filter(hiddenCard => !isEqual(hiddenCard, card));
				break;
			}
		}
	}

	// MISCELLANEA
	get nodeType() {
		if (this.lastCards().some(card => typeof(card) !== 'undefined' ? card.hidden : false)) {
			return 'chance'
		} else {
			return 'player'
		}
	}
	toString() {
		// console.groupCollapsed('Solitaire');
		// 	console.group('Board')
		// 		console.log('WASTE:', this.waste.cards.map(card => getString(card)));
		// 		console.log('TABLEAUS:', this.tableaus.map(tableau => tableau.cards.map(card => getString(card))));
		// 		console.log('FOUNDATIONS:', this.foundations.map(foundation => foundation.cards.map(card => getString(card))));
		// 	console.groupEnd();
		// 	console.group('Info');
		// 		console.log('Node Type:', this.nodeType)
		// 	console.groupEnd();
		// console.groupEnd();
	}
	lastCards() {
		return this.tableaus.map(tableau => tableau.lastCard);
	}

}


function Card({ rank, suit, hidden }) {
	return (
		<motion.div
			className = {styles.card}
			style     = {{ color : RedSuits.has(suit) ? RED : BLACK }}
			layoutId  = { typeof(rank) === 'string' ? rank.concat(suit) : null }
			// drag            = {true}
			// dragElastic     = {true}
			// dragConstraints = {{top:0, bottom:0, left:0, right:0}}
		>
			{getString({rank:rank, suit:suit, hidden:hidden})}
		</motion.div>
	)
}

function SolitaireComponent() {

	// TODO: Figure out a way to do this without force updating
	const forceUpdate = useForceUpdate();

	// const deck = getShuffledDeck();
	// const solitaire = useRef(new Solitaire(
	// 	deck.waste,
	// 	deck.tableaus,
	// 	deck.foundations,
	// 	deck.hiddenCards,
	// ))

	const {waste, tableaus, foundations, hiddenCards} = test_moves_to_empty_piles;
	const solitaire = useRef(new Solitaire(
		waste,
		tableaus,
		foundations,
		hiddenCards,
	))

	const handlePlayerMove = React.useCallback((move) => {
		solitaire.current.applyPlayerMove(move.source.card, move.target.card);
		forceUpdate()
	}, [forceUpdate])
	const handleChanceMove = React.useCallback((move) => {
		solitaire.current.applyChanceMove(move);
		forceUpdate()
	}, [forceUpdate])

	const waste_element       = (<>
		<motion.div className={styles.waste}>
			{ solitaire.current.waste.cards.map((card, index) => <Card rank={card.rank} suit={card.suit} hidden={card.hidden} key={index} />) }
		</motion.div>
	</>);
	const foundations_element = (<>
		<motion.div className={styles.foundations}>
			{
				solitaire.current.foundations.map((foundation, index) => (
					<motion.div className={styles.foundation} key={index}>
						{ foundation.cards.map((card, index) => <Card rank={card.rank} suit={card.suit} hidden={card.hidden} key={index} />) }
					</motion.div>
				))
			}
		</motion.div>
	</>);
	const tableaus_element    = (<>
		<motion.div className={styles.tableaus}>
			{
				solitaire.current.tableaus.map((tableau, index) => (
					<motion.div className={styles.tableau} key={index}>
						{ tableau.cards.map((card, index) => <Card rank={card.rank} suit={card.suit} hidden={card.hidden} key={index} />) }
					</motion.div>
				))
			}
		</motion.div>
	</>);
	const actions_element     = (<>
		<motion.div className={styles.actions}>
			{
				solitaire.current.nodeType === 'player' ?
						solitaire.current.legalPlayerMoves().map((move, index) => (
							<motion.div
								className  = {styles.action}
								whileHover = {{ scale: 1.10 }}
								whileTap   = {{ scale: 0.85 }}
								onClick    = {() => handlePlayerMove(move)}
								key        = {index}
							>
								{console.log(move)}
								{getString(move.source.card)}{'→'}{getString(move.target.card)}
							</motion.div>
						)) : solitaire.current.legalChanceMoves().map((move, index) => (
							<motion.div
								className  = {styles.action}
								whileHover = {{ scale: 1.10 }}
								whileTap   = {{ scale: 0.85 }}
								onClick    = {() => handleChanceMove(move)}
								key        = {index}
							>
								{getString(move)}
							</motion.div>
						))
			}
		</motion.div>
	</>);

	return (
		<AnimateSharedLayout>
			<motion.div className={styles.board}>
				{waste_element}
				{foundations_element}
				{tableaus_element}
				{actions_element}
			</motion.div>
		</AnimateSharedLayout>
	);

}








function SolitaireExample() {
	console.clear();



	return (<>
		<motion.div>
			Solitaire Example
			<SolitaireComponent />
		</motion.div>
	</>);
}
export default SolitaireExample;