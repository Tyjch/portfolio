import React, { useCallback, useRef, useEffect, useState } from 'react'
import { VscDebugStart, VscDebugStop } from 'react-icons/vsc'
import { AnimateSharedLayout, motion} from 'framer-motion'
import Solitaire, { getImperfectState } from "../../classes/solitaire";
import useForceUpdate from "../../hooks/useForceUpdate";
import styles from '../../styles/projects/solitaire.module.css'


function ReactCard({ card }) {
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

function ReactSolitaire({ solitaire, speed, autorun, interactive, controllable }) {
	// TODO: Split `speed` and `autorun` into their own component to control props of `ReactSolitaire`

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
			}, speed);
			return () => clearInterval(timer);
		}
	}, [isRunning, forceUpdate])

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

	const control_element     = (<>
		<motion.div style = {{ display : 'flex', alignItems : 'center', justifyContent : 'center', padding : '20px' }}>
				{
					isRunning ?
						<VscDebugStop  color={'white'} onClick = { () => isRunning ? setRunning(false) : setRunning(true) } /> :
						<VscDebugStart color={'white'} onClick = { () => isRunning ? setRunning(false) : setRunning(true) } />
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
				{ interactive ? actions_element : null }
				<motion.div className={styles.board}>
					<motion.div style={{ display : 'flex', justifyContent : 'space-between' }}>
						{ controllable ? control_element : null }
						{foundations_element}
					</motion.div>
					{tableaus_element}
				</motion.div>
				{ ref.current.waste.size >= 1 ? waste_element : null }
			</motion.div>
		</AnimateSharedLayout>
	</>);

	return (<>
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
export { ReactSolitaire, ReactCard };

