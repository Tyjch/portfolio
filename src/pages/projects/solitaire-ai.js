import React from "react"
import Article, { Paragraph, Section } from "../../components/article"
import SolitaireExample from '../../components/projects/solitaire3'
import Coder from "../../components/code";
import SolitaireAIData from "../../../content/projects/solitaire-ai.yaml"
import Lorem from "react-lorem-component";


function SolitaireAI() {

  const solitaire_example = <SolitaireExample />

  return (
    <Article data={SolitaireAIData}>

      <Section title={'Introduction'} id={'#introduction'}>
        <Paragraph example={solitaire_example}>
          <p>
            Research in klondike solitaire has generally been focused on estimating
            its solvability. They usually assume that the values of hidden cards are
            known to the player, a form known as thoughtful solitaire. Any game that
            is solvable in thoughtful solitaire is also solvable in regular solitaire.
            As as result, research in this area has shown that the solvability of
            solitaire lies between ~82% and ~91% <cite>(Bjarnason et al.)</cite>
          </p>
        </Paragraph>
        <Paragraph example={<pre>'Iterate through possible values of hidden cards'</pre>}>
          <p>
            While these bounds are interesting, they rely on the assumption of
            perfect information (i.e. every card is known). In reality, solitaire
            is played under uncertainty; you have to consider every permutation of
            hidden cards and act accordingly. Even with a single deal of solitaire,
            there are 21! permutations of hidden cards; far too many for a human or
            computer to calculate.
          </p>
        </Paragraph>
        <Paragraph example={<pre>'Deep Reinforcement Learning'</pre>}>
          <p>
            Deep reinforcement learning solves this problem by training a deep
            neural network to approximate the value of arbitrary states or actions.
            Using these networks, we can derive a strategy that generalizes to
            states that likely have never seen before. Before we get to that point,
            we have to create an environment that defines the observations, actions,
            and rewards in solitaire.
          </p>
        </Paragraph>
      </Section>

      <Section title={'Environment'} id={'#environment'}>
        <Paragraph example={<pre>'SARSA Loop'</pre>}>
          In reinforcement learning, an environment is what the agent interacts with. It provides information
          about its current state and rewards for previous actions. The agent uses the rewards to improve its policy,
          and this policy is used to determine what action should be picked when a certain state is encountered.
          When an action is chosen, the state of the environment changes and another set of observations and rewards is
          provided to the agent.
        </Paragraph>

      </Section>

    </Article>
  )
}

export default SolitaireAI;
