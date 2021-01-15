const StateType = {
	terminal : 0,
	player   : 1,
	chance   : -1,
};

class GameState {
	constructor(depth=0) {
		this.depth = depth;
	}

	legalActions() {
		return [];
	};
	legalOutcomes() {
		return [];
	};

	applyAction(action) {
		// TODO: If `action` is in `legal_actions` and is applied, increment `depth` and add it to history.


	};
	applyOutcome(outcome) {

	};

	getClone() {
		return new GameState(this.depth);
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
		return 0;
	};
	get players() {
		return [];
	};
	get rewards() {
		return this.players.map(player => 0.0);
	};
	get returns() {
		return this.players.map(player => 0.0);
	};
	get type() {
		return StateType.player;
	};
}

export default GameState;
export {StateType};