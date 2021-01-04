import { Card, Pile, Tableau, Foundation, Solitaire, SUITS, RANKS } from "../projects/solitaire";

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

// describe.each(valid_cards)('new Card(%s, %s, %p)', (rank, suit, hidden) => {
// 	describe(`has valid`, () => {
// 		test('.rank', () => {
// 			const card = new Card(rank, suit, hidden);
// 			expect(card.rank).toEqual(rank);
// 		});
// 		test('.suit', () => {
// 			const card = new Card(rank, suit, hidden);
// 			expect(card.suit).toEqual(suit);
// 		});
// 		test('.hidden', () => {
// 			const card = new Card(rank, suit, hidden);
// 			if (card.rank === '' && card.suit === '') {
// 				expect(card.hidden).toEqual(true);
// 			} else {
// 				expect(card.hidden).toEqual(hidden);
// 			}
// 		})
// 	})
// })
//
// describe('Card', () => {
// 	describe('created with', () => {
// 		describe.each(SUITS)("suit='%s'", (suit) => {
// 			describe.each(RANKS)(", rank='%s'", (rank) => {
// 				describe.each([true, false])(", and hidden='%s'", (hidden) => {
// 					const card = new Card(rank, suit, hidden);
//
// 					test('has valid rank', () => {
// 						expect(card.rank).toEqual(rank);
// 					})
// 				})
// 			})
// 		})
// 	})
// })


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
