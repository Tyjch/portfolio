import { Card, Pile, Tableau, Foundation, Solitaire, SUITS, RANKS, getImperfectState } from "../projects/solitaire";

function random_choice(array) {
	return array[Math.floor(Math.random() * array.length)];
}
function generateValidCards() {
	let valid_cards = [];
	for (const hidden of [true, false]) {
		for (const suit of SUITS) {
			for (const rank of RANKS) {
				valid_cards.push([rank, suit, hidden]);
			}
		}
	}
	return valid_cards;
}
const valid_cards = generateValidCards();

// NOTE: `empty` and `non-empty` both imply that the argument is valid
// NOTE: `empty` means the argument is provided as the empty string ''

test('Card created with invalid rank throws an error', () => {
	expect(() => new Card('Z', 's')).toThrow(Error);
})
test('Card created with invalid suit throws an error', () => {
	expect(() => new Card('K', 'Z')).toThrow(Error);
})
test('Card with no rank & suit must be hidden', () => {
	const card = new Card('', '', false);
	expect(card.hidden).toEqual(true);
})
test('Cards with different ranks are not equal', () => {
	const card = new Card('K', 's');
	const other_card = new Card('Q', 's');
	expect(card.is_equal(other_card)).toEqual(false);
})
test('Cards with different suits are not equal', () => {
	const card = new Card('K', 's');
	const other_card = new Card('K', 'h');
	expect(card.is_equal(other_card)).toEqual(false);
})
test('Cards with different hidden status are not equal', () => {
	const card = new Card('K', 's', false);
	const other_card = new Card('K', 's', true);
	expect(card.is_equal(other_card)).toEqual(false);
})
test('Cards with the same rank and suit that are not hidden are equal', () => {
	const card = new Card('K', 's', false);
	const other_card = new Card('K', 's', false);
	expect(card.is_equal(other_card)).toEqual(true);
})
test('Cards with the same rank and suit that are hidden are not equal', () => {
	const card = new Card('K', 's', true);
	const other_card = new Card('K', 's', true);
	expect(card.is_equal(other_card)).toEqual(false);
})

test('Solitaire is deep-copied, actions in one do not effect the other', () => {
	const deck = getImperfectState();
	let original_solitaire = new Solitaire(deck.waste, deck.tableaus, deck.foundations, deck.hidden_cards);
	let cloned_solitaire   = original_solitaire.clone();

	const snapshot = original_solitaire.to_string();

	for (let i = 0; i < 5; i++) {
		console.log(`Iteration ${i} ---------------------------------------------------------`);
		console.log('Cloned:', cloned_solitaire.to_string());

		const legal_actions = cloned_solitaire.legalMoves();
		const chosen_action = random_choice(legal_actions);

		switch (cloned_solitaire.type) {
			case 'player' : {
				console.log('chosen action:\n', chosen_action.card.to_string(), '->', chosen_action.target_pile.to_string());
				cloned_solitaire.applyMove(chosen_action);
				break;
			}
			case 'chance' : {
				console.log('chosen outcome:\n', chosen_action.to_string());
				cloned_solitaire.applyOutcome(chosen_action);
				break;
			}
			default : {
				console.error('cloned_solitaire.type !== player or chance')
				break;
			}
		}



	}


})