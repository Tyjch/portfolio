import React, { useState, useRef, useReducer } from 'react';
import { motion } from "framer-motion";
import { StateType } from "../../classes/game";


function GameController({initial_game}) {
	const game = useRef(initial_game);
	const [step, setStep] = useState(0);

	function applyAction(action) {
		console.log('click');
		game.current.applyAction(action);
		setStep(step + 1);
	}
	function changeGame(game) {

	}

	const board   = game.current.board;
	const actions = game.current.legalActions();

	return (
		<div>
			Game Controller
			<div style={{ display : 'flex', justifyContent : 'space-around' }}>

				<div style={{ width : '200px' }}>
					State
					<hr/>
					{
						board.map((row, i) => (
							<div key={i} style={{ display : 'flex' }}>
								{
									row.map((cell, j) => (
										<div
											key   = {j}
											style = {{
												margin : '5px',
												width  : '30px',
												height : '30px',
												textAlign : 'center',
												borderRadius : '3px',
												backgroundColor : 'white',
											}}
										>
											{cell}
										</div>
									))
								}
							</div>
						))
					}
				</div>

				<div style={{ width : '200px' }}>
					Actions
					<hr/>
					{ actions.map((action, index) => (
						<motion.div whileHover={{ scale : 1.1 }} onClick={() => applyAction(action)}>
							{`[${action.row}][${action.col}] = ${action.player}`}
						</motion.div>
					))}
				</div>

			</div>
		</div>
	);

}






export default GameController;