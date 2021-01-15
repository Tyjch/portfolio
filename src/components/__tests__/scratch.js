import { StateType } from "../../classes/game";
import TicTacToeState from "../../classes/games/tictactoe";

const steps = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const trajectories = [
	[
		{row: 1, col: 1, player: 1},
		{row: 1, col: 0, player: 2},
		{row: 0, col: 1, player: 1},
		{row: 2, col: 1, player: 2},
		{row: 2, col: 0, player: 1},
		{row: 0, col: 2, player: 2},
		{row: 2, col: 2, player: 1},
		{row: 0, col: 0, player: 2},
		{row: 1, col: 2, player: 1}
	],
];

describe('TicTacToe', () => {
	let game = new TicTacToeState();

	describe.each(steps)('depth: %s', step => {

		test('current_player', () => {
			console.log(game.current_player);
		});

		test('players', () => {
			console.log(game.players);
		});

		test('rewards', () => {
			console.log(game.rewards);
		});

		test('returns', () => {
			console.log(game.returns);
		});

		test('type', () => {
			console.log(game.type);
		});

		test('LegalActions()', () => {
			console.log(game.legalActions());
		});

		test('applyAction()', () => {
			const legal_actions = game.legalActions();
			const chosen_action = legal_actions ? legal_actions[0] : null;
			if (chosen_action) {
				game.applyAction(chosen_action);
			}
		});

		test('this.board', () => {
			console.log(game.board);
		});

		test('_winning_player', () => {
			game._winning_player;
		})
	})
})

describe('TicTacToe', () => {
	describe.each([trajectories])('', trajectory => {

		test('current_player', () => {
			const game = new TicTacToeState();
			console.log(`BOARD : ${game.board}`);
			trajectory.forEach(move => {
				console.log(`
${game.rows[0][0]} | ${game.rows[0][1]} | ${game.rows[0][2]}
${game.rows[1][0]} | ${game.rows[1][1]} | ${game.rows[1][2]}
${game.rows[2][0]} | ${game.rows[2][1]} | ${game.rows[2][2]}
MOVE   : row:${move.row} col:${move.col} player:${move.player}
PLAYER : ${game.current_player}
				`);
				game.applyAction(move);
			});
		});
	});
})