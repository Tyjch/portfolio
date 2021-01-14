import random_choice from "../utils/random";

class RandomAgent {
	choose_action(legal_actions) {
		return random_choice(legal_actions);
	}
}

export default RandomAgent;