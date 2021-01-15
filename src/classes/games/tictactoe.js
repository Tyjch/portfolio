import GameState, {StateType} from "../game";


const ActionFormatter = (action) => {
	const glyphs = new Map([
		[1, 'X'],
		[2, 'O'],
	]);
	return `[${action.row}][${action.col}] = ${glyphs.get(action.player)}`;
};

class TicTacToeState extends GameState {
	constructor(board=[[null, null, null], [null, null, null], [null, null, null]], depth=0) {
		super(depth);
		this.board = board;
	};

	legalActions() {
		if (this.type === StateType.player) {
			const current_player = this.current_player;
			let legal_actions    = [];
			this.board.forEach((row, i) => {
				row.forEach((cell, j) => {
					if (!cell) {
						legal_actions.push({
							row    : i,
							col    : j,
							player : current_player,
						});
					}
				})
			});
			return legal_actions;
		} else {
			return [];
		}
	};
	applyAction(action) {
		if (this.type === StateType.player && action.player === this.current_player) {
			this.board[action.row][action.col] = action.player;
			this.depth += 1;
		}
	};

	legalOutcomes() {
		return super.legalOutcomes();
	}
	applyOutcome(outcome) {
		super.applyOutcome(outcome);
	}

	getClone() {
		return new TicTacToeState(this.depth);
	}
	getChild(action_or_outcome) {
		let childState = this.getClone();
		switch (this.type) {
			case StateType.player : {
				childState.applyAction(action_or_outcome);
				return childState;
			}
			case StateType.chance : {
				childState.applyOutcome(action_or_outcome);
				return childState;
			}
			case StateType.terminal : {
				console.error('GameState.getChild(): Cannot get child of terminal node');
				break;
			}
			default : {
				console.error('GameState.getChild(): this.type is not one of (player, chance, terminal)');
				break;
			}
		}
	}

	get current_player() {
		return this.depth % 2 === 0 ? this.players[0] : this.players[1];
	};
	get players() {
		return [1, 2];
	};
	get rewards() {
		let rewards = [0.0, 0.0];
		const winning_player = this.winning_player;
		if (winning_player) {
			rewards[winning_player - 1] = 1.0;
		}
		return rewards;
	};
	get returns() {
		return this.rewards;
	};
	get type() {
		if (this.depth >= 9 || this.winning_player) {
			return StateType.terminal;
		} else {
			return StateType.player;
		}
	};

	get state() {
		return {
			state          : this.board,
			legal_actions  : this.legalActions(),
			legal_outcomes : this.legalOutcomes(),
			current_player : this.current_player,
			players        : this.players,
			rewards        : this.rewards,
			returns        : this.returns,
			type           : this.type,
		};
	}

	get rows() {
		return this.board;
	};
	get columns() {
		return this.board[0].map((_, colIndex) => this.board.map(row => row[colIndex]));
	};
	get diagonals() {
		return [
			[this.board[0][0], this.board[1][1], this.board[2][2]],
			[this.board[0][2], this.board[1][1], this.board[2][0]],
		];
	};
	get winning_player() {
		for (const subset of [...this.rows, ...this.columns, ...this.diagonals]) {
			const is_winning_move  = subset.every((val, i, arr) => val && val === arr[0]);
			const potential_winner = subset[0];
			if (is_winning_move) { return potential_winner; }
		}
		return null;
	};
}


export default TicTacToeState;
export { ActionFormatter };