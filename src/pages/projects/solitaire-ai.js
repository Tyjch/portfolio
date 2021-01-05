import React from "react"
import Article, { Paragraph, Section } from "../../components/article"
import { Solitaire, ReactSolitaire, getPerfectState } from '../../components/projects/solitaire'
import SolitaireAIData from "../../../content/projects/solitaire-ai.yaml"
import Lorem from "react-lorem-component";

// import { motion, AnimatePresence } from "framer-motion"
// import Coder from "../../components/code";



function SolitaireAI() {

  const deck = getPerfectState();
  const examples = {
    introduction : (<>
      <ReactSolitaire
        solitaire    = { new Solitaire(deck.waste, deck.tableaus, deck.foundations, deck.hidden_cards) }
        interactive  = {false}
        controllable = {false}
        autorun      = {true}
        speed        = {300}
      />
    </>),
  }


  return (
    <Article data={SolitaireAIData}>

      <Section title={'Introduction'} id={'#introduction'}>
        <Paragraph example={examples.introduction} onEnter={(x) => console.log('onEnter content:', x)}>
          <p>
            Research in klondike solitaire has generally been focused on estimating
            its solvability. It's usually assumed that the values of hidden cards are
            known to the player; a form known as thoughtful solitaire. The figure to
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
        <Paragraph>
          <p>
            This is due largely to the kinds of information provided. With thoughtful solitaire
            (and other single-player, perfect information games), we can generally solve it by
            planning our moves in advance. On the other hand, imperfect information games
            generally have too many variables to consider.

          </p>
        </Paragraph>
        {/*<Paragraph example={<pre>'Iterate through possible values of hidden cards'</pre>}>*/}
        {/*  <p>*/}
        {/*    While these bounds are interesting, they rely on the assumption of*/}
        {/*    perfect information (i.e. every card is known). In reality, solitaire*/}
        {/*    is played under uncertainty; you have to consider every permutation of*/}
        {/*    hidden cards and act accordingly. Even with a single deal of solitaire,*/}
        {/*    there are 21! permutations of hidden cards; far too many for a human or*/}
        {/*    computer to calculate.*/}
        {/*  </p>*/}
        {/*</Paragraph>*/}
        {/*<Paragraph example={<pre>'Deep Reinforcement Learning'</pre>}>*/}
        {/*  <p>*/}
        {/*    Deep reinforcement learning solves this problem by training a deep*/}
        {/*    neural network to approximate the value of arbitrary states or actions.*/}
        {/*    Using these networks, we can derive a strategy that generalizes to*/}
        {/*    states that likely have never seen before. Before we get to that point,*/}
        {/*    we have to create an environment that defines the observations, actions,*/}
        {/*    and rewards in solitaire.*/}
        {/*  </p>*/}
        {/*</Paragraph>*/}
      </Section>

      {/*<Section title={'Environment'} id={'#environment'}>*/}
      {/*  <Paragraph example={<pre>'SARSA Loop'</pre>}>*/}
      {/*    In reinforcement learning, an environment is what the agent interacts with. It provides information*/}
      {/*    about its current state and rewards for previous actions. The agent uses the rewards to improve its policy,*/}
      {/*    and this policy is used to determine what action should be picked when a certain state is encountered.*/}
      {/*    When an action is chosen, the state of the environment changes and another set of observations and rewards is*/}
      {/*    provided to the agent.*/}
      {/*  </Paragraph>*/}
      {/*</Section>*/}

      <br />
      <Section title={'Other'} id={'#other'}>
        <div style={{ color : 'white' }}>
          <Lorem count={10} />
        </div>
      </Section>

    </Article>
  )
}

export default SolitaireAI;
