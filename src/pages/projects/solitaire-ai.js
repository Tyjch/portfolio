import React from "react"
import Article, { Paragraph, Section } from "../../components/article"
import { ReactSolitaire } from '../../components/projects/solitaire'
import Solitaire, { getPerfectState } from "../../classes/solitaire";
import SolitaireAIData from "../../../content/projects/solitaire-ai.yaml"
import Lorem from "react-lorem-component";

// import { motion, AnimatePresence } from "framer-motion"
import Coder from "../../components/code";



function SolitaireAI() {

  const deck = getPerfectState();
  const examples = {
    introduction : (
      <ReactSolitaire
        solitaire    = { new Solitaire(deck.waste, deck.tableaus, deck.foundations, deck.hidden_cards) }
        interactive  = {false}
        controllable = {false}
        autorun      = {true}
        speed        = {300}
      />
    ),
    game_tree    : (
      <p> Compare game trees with perfect information vs. imperfect information </p>
    ),
    piles        : (
      <Coder
        language = {'lang-js'}
        code     = {`console.log('Piles');`}
      />
    ),
  }

  return (
    <Article data={SolitaireAIData}>

      <Section title={'Introduction'} id={'#introduction'}>
        <Paragraph example={examples.introduction} onEnter={(x) => console.log('onEnter content:', x)}>
          <p>
            Research in <b>klondike solitaire</b> has generally been focused on estimating
            its solvability. It's usually assumed that the values of hidden cards are
            known to the player; a form known as <b>thoughtful solitaire</b>. The figure to
            the right shows an example of this being played by a random agent.
          </p>
          <p>
            Any game that is solvable in thoughtful solitaire is also able to be
            solved in regular solitaire. But knowing how to solve it is very different
            from knowing that it can be solved. It's estimated that between ~82% and
            ~91% of possible deals are able to be solved, yet human experts are lucky
            if they can solve a third of those. <cite>(Bjarnason et al.)</cite>
          </p>
        </Paragraph>
        <Paragraph example={examples.game_tree}>
          <p>
            This is due largely to the kinds of information provided. With thoughtful solitaire
            (and other single-player, perfect information games), we can generally solve it by
            planning our moves in advance. On the other hand, imperfect information games
            generally have too many variables to consider.
          </p>
        </Paragraph>
      </Section>

      <Section title={'Environment'} id={'#environment'}>
        <Paragraph example={<pre>'SARSA Loop'</pre>}>
          <p>
            In reinforcement learning, an environment is what the agent interacts with. It provides information
            about its current state and rewards for previous actions. The agent uses the rewards to improve its policy,
            and this policy is used to determine what action should be picked when a certain state is encountered.
            When an action is chosen, the state of the environment changes and another set of observations and rewards
            is provided to the agent.
          </p>
        </Paragraph>
      </Section>

      <Section title={'Piles'} id={'#piles'}>
        <Paragraph example={examples.piles}>
          <p>
            At the lowest level, solitaire is made up of cards. But the actual rules that define what cards can be
            moved where are defined in piles. They are essentially wrappers around a vector of cards and limit what can
            and can't be added or removed from their underlying vector.
          </p>
        </Paragraph>
      </Section>


    </Article>
  )
}

export default SolitaireAI;
