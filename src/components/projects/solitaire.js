import React, { useCallback, useRef, useEffect, useState } from 'react'
import {AnimatePresence, AnimateSharedLayout, motion} from 'framer-motion'
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
const PILES_SET = new Set(PILES);

const PATTERNS = {
	temple      : `url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'152\' height=\'152\' viewBox=\'0 0 152 152\'%3E%3Cg fill-rule=\'evenodd\'%3E%3Cg id=\'temple\' fill=\'%239a9a9a\' fill-opacity=\'0.26\'%3E%3Cpath d=\'M152 150v2H0v-2h28v-8H8v-20H0v-2h8V80h42v20h20v42H30v8h90v-8H80v-42h20V80h42v40h8V30h-8v40h-42V50H80V8h40V0h2v8h20v20h8V0h2v150zm-2 0v-28h-8v20h-20v8h28zM82 30v18h18V30H82zm20 18h20v20h18V30h-20V10H82v18h20v20zm0 2v18h18V50h-18zm20-22h18V10h-18v18zm-54 92v-18H50v18h18zm-20-18H28V82H10v38h20v20h38v-18H48v-20zm0-2V82H30v18h18zm-20 22H10v18h18v-18zm54 0v18h38v-20h20V82h-18v20h-20v20H82zm18-20H82v18h18v-18zm2-2h18V82h-18v18zm20 40v-18h18v18h-18zM30 0h-2v8H8v20H0v2h8v40h42V50h20V8H30V0zm20 48h18V30H50v18zm18-20H48v20H28v20H10V30h20V10h38v18zM30 50h18v18H30V50zm-2-40H10v18h18V10z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
	autumn      : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='88' height='24' viewBox='0 0 88 24'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='autumn' fill='%239a9a9a' fill-opacity='0.26'%3E%3Cpath d='M10 0l30 15 2 1V2.18A10 10 0 0 0 41.76 0H39.7a8 8 0 0 1 .3 2.18v10.58L14.47 0H10zm31.76 24a10 10 0 0 0-5.29-6.76L4 1 2 0v13.82a10 10 0 0 0 5.53 8.94L10 24h4.47l-6.05-3.02A8 8 0 0 1 4 13.82V3.24l31.58 15.78A8 8 0 0 1 39.7 24h2.06zM78 24l2.47-1.24A10 10 0 0 0 86 13.82V0l-2 1-32.47 16.24A10 10 0 0 0 46.24 24h2.06a8 8 0 0 1 4.12-4.98L84 3.24v10.58a8 8 0 0 1-4.42 7.16L73.53 24H78zm0-24L48 15l-2 1V2.18A10 10 0 0 1 46.24 0h2.06a8 8 0 0 0-.3 2.18v10.58L73.53 0H78z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
	wiggle      : `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239a9a9a' fill-opacity='0.26'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
	houndstooth : `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ctitle%3Ehoundstooth%3C/title%3E%3Cg fill='%239a9a9a' fill-opacity='0.26' fill-rule='evenodd'%3E%3Cpath d='M0 18h6l6-6v6h6l-6 6H0M24 18v6h-6M24 0l-6 6h-6l6-6M12 0v6L0 18v-6l6-6H0V0'/%3E%3C/g%3E%3C/svg%3E")`,
	diamonds    : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM0 28l14.142 14.142-1.414 1.414L0 30.828V28zm0 5.657L11.314 44.97 9.9 46.386l-9.9-9.9v-2.828zm0 5.657L8.485 47.8 7.07 49.212 0 42.143v-2.83zm0 5.657l5.657 5.657-1.414 1.415L0 47.8v-2.83zm0 5.657l2.828 2.83-1.414 1.413L0 53.456v-2.83zM54.627 60L30 35.373 5.373 60H8.2L30 38.2 51.8 60h2.827zm-5.656 0L30 41.03 11.03 60h2.828L30 43.858 46.142 60h2.83zm-5.656 0L30 46.686 16.686 60h2.83L30 49.515 40.485 60h2.83zm-5.657 0L30 52.343 22.343 60h2.83L30 55.172 34.828 60h2.83zM32 60l-2-2-2 2h4zM59.716 0l-28 28 1.414 1.414L60 2.544V0h-.284zM60 5.373L34.544 30.828l1.414 1.415L60 8.2V5.374zm0 5.656L37.373 33.656l1.414 1.414L60 13.86v-2.83zm0 5.656l-19.8 19.8 1.415 1.413L60 19.514v-2.83zm0 5.657l-16.97 16.97 1.414 1.415L60 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415 9.9-9.9v-2.828zm0 5.657L51.515 47.8l1.414 1.413 7.07-7.07v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83zM39.9 16.385l1.414-1.414L30 3.658 18.686 14.97l1.415 1.415 9.9-9.9 9.9 9.9zm-2.83 2.828l1.415-1.414L30 9.313 21.515 17.8l1.414 1.413 7.07-7.07 7.07 7.07zm-2.827 2.83l1.414-1.416L30 14.97l-5.657 5.657 1.414 1.415L30 17.8l4.243 4.242zm-2.83 2.827l1.415-1.414L30 20.626l-2.828 2.83 1.414 1.414L30 23.456l1.414 1.414zM56.87 59.414L58.284 58 30 29.716 1.716 58l1.414 1.414L30 32.544l26.87 26.87z' fill='%239a9a9a' fill-opacity='0.26' fill-rule='evenodd'/%3E%3C/svg%3E")`,
	zigzag      : `url("data:image/svg+xml,%3Csvg width='40' height='12' viewBox='0 0 40 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6.172L6.172 0h5.656L0 11.828V6.172zm40 5.656L28.172 0h5.656L40 6.172v5.656zM6.172 12l12-12h3.656l12 12h-5.656L20 3.828 11.828 12H6.172zm12 0L20 10.172 21.828 12h-3.656z' fill='%239a9a9a' fill-opacity='0.26' fill-rule='evenodd'/%3E%3C/svg%3E")`,
	aztec       : `url("data:image/svg+xml,%3Csvg width='32' height='64' viewBox='0 0 32 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 28h20V16h-4v8H4V4h28v28h-4V8H8v12h4v-8h12v20H0v-4zm12 8h20v4H16v24H0v-4h12V36zm16 12h-4v12h8v4H20V44h12v12h-4v-8zM0 36h8v20H0v-4h4V40H0v-4z' fill='%239a9a9a' fill-opacity='0.26' fill-rule='evenodd'/%3E%3C/svg%3E")`,
	clouds      : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%239a9a9a' fill-opacity='0.26' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E")`,
	melt        : `url("data:image/svg+xml,%3Csvg width='24' height='20' viewBox='0 0 24 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 18c0-1.105.887-2 1.998-2 1.104 0 2-.895 2.002-1.994V14v6h-4v-2zM0 13.998C0 12.895.888 12 2 12c1.105 0 2 .888 2 2 0 1.105.888 2 2 2 1.105 0 2 .888 2 2v2H0v-6.002zm16 4.004A1.994 1.994 0 0 1 14 20c-1.105 0-2-.887-2-1.998v-4.004A1.994 1.994 0 0 0 10 12c-1.105 0-2-.888-2-2 0-1.105-.888-2-2-2-1.105 0-2-.887-2-1.998V1.998A1.994 1.994 0 0 0 2 0a2 2 0 0 0-2 2V0h8v2c0 1.105.888 2 2 2 1.105 0 2 .888 2 2 0 1.105.888 2 2 2 1.105 0 2-.888 2-2 0-1.105.888-2 2-2 1.105 0 2-.888 2-2V0h4v6.002A1.994 1.994 0 0 1 22 8c-1.105 0-2 .888-2 2 0 1.105-.888 2-2 2-1.105 0-2 .887-2 1.998v4.004z' fill='%239a9a9a' fill-opacity='0.26' fill-rule='evenodd'/%3E%3C/svg%3E")`,
	overlap     : `url("data:image/svg+xml,%3Csvg width='48' height='64' viewBox='0 0 48 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M48 28v-4L36 12 24 24 12 12 0 24v4l4 4-4 4v4l12 12 12-12 12 12 12-12v-4l-4-4 4-4zM8 32l-6-6 10-10 10 10-6 6 6 6-10 10L2 38l6-6zm12 0l4-4 4 4-4 4-4-4zm12 0l-6-6 10-10 10 10-6 6 6 6-10 10-10-10 6-6zM0 16L10 6 4 0h4l4 4 4-4h4l-6 6 10 10L34 6l-6-6h4l4 4 4-4h4l-6 6 10 10v4L36 8 24 20 12 8 0 20v-4zm0 32l10 10-6 6h4l4-4 4 4h4l-6-6 10-10 10 10-6 6h4l4-4 4 4h4l-6-6 10-10v-4L36 56 24 44 12 56 0 44v4z' fill='%239a9a9a' fill-opacity='0.26' fill-rule='evenodd'/%3E%3C/svg%3E")`,
};
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
	const variants = {
		visible : (custom) => ({
			color : 'filter'
		}),
		hidden  : (custom) => ({

		}),
	}
	const is_empty = card.hidden && card.rank === '' && card.suit === '';

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

function ReactSolitaire({ solitaire, autorun, interactive, pausable }) {

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
			}, 800);
			return () => clearInterval(timer);
		}
	}, [isRunning])

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
				{interactive ? actions_element : null}
				<motion.div className={styles.board}>
					{foundations_element}
					{tableaus_element}
				</motion.div>
				{waste_element}
			</motion.div>
		</AnimateSharedLayout>
	</>);
	const control_element     = (<>
		<motion.div style={{ padding : '20px' }}>
			<motion.button
				onClick = { () => isRunning ? setRunning(false) : setRunning(true) }
				style   = {{
					backgroundColor : '#171717',
					color           : '#ffffff',
					width           : '200px',
				}}
			>
				{isRunning ? 'STOP' : 'START'}
			</motion.button>
		</motion.div>
	</>)

	return (<>
		{ pausable ? control_element : null }
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