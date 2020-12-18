import React from "react"
import Article, { Paragraph, Section } from "../../components/article"
import SolitaireAIData from "../../../content/projects/solitaire-ai.yaml"
import Lorem from "react-lorem-component";


function SolitaireAI() {
  return (
    <Article data={SolitaireAIData}>

      <Section title={'Introduction'} id={'#introduction'}>
        <Paragraph example={<pre>'Thoughtful Solitaire & Solvability'</pre>}>
          <p>
          There have been a few approaches to solving klondike solitaire in the
          past. They usually assume that the values of hidden cards are known to
          the player, a form known as thoughtful solitaire. Any game that is
          solvable in thoughtful solitaire is also solvable in regular solitaire.
          As as result, research in this area has shown that the solvability of
          solitaire lies between ~82% and ~91% <cite>(Bjarnason et al.)</cite>
          </p>
        </Paragraph>
        <Paragraph example={<pre>'Perfect vs Imperfect Information'</pre>}>
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

      <Section title={'Support Classes'} id={'#support-classes'}>
        <Paragraph example={<pre>'Solitaire Anatomy'</pre>}>
          <p>
            Solitaire fundamentally boils down to piles of cards and rules for moving
            cards between them. So before we get started on the environment, we'll
            implement some classes that will encapsulate the objects we'll be operating
            on. While not all environments take the OOP approach, in this case it
            certainly made it easier to reason about and debug.
          </p>
        </Paragraph>

        <Section title={'Cards'} id={'#cards'}>
          <Paragraph example={<pre>'Cards Code'</pre>}>
            <p>
              Cards are essentially defined by their rank and suit (which can be
              represented as an integer) and whether they are hidden or not.
              Although the location of a card within a state should technically
              belong to the <code>SolitaireState</code> class, in this instance
              it's helpful to keep it within this class instead.
            </p>
          </Paragraph>
        </Section>

        <Section title={'Piles'} id={'#piles'}>
          <Paragraph example={<pre>'Fourth example'</pre>}>
            <Lorem count={2} seed={3} />
          </Paragraph>
          <Section title={'Tableaus'} id={'#tableaus'}>
            <Paragraph example={<pre>'Fifth example'</pre>}>
              <Lorem count={2} seed={4} />
            </Paragraph>
          </Section>
          <Section title={'Foundations'} id={'#foundations'}>
            <Paragraph example={<pre>'Sixth example'</pre>}>
              <Lorem count={2} seed={5} />
            </Paragraph>
          </Section>
          <Section title={'Waste'} id={'#waste'}>
            <Paragraph example={<pre>'Seventh example'</pre>}>
              <Lorem count={2} seed={6} />
            </Paragraph>
          </Section>
        </Section>

        <Section title={'Moves'} id={'#moves'}>
          <Paragraph example={<pre>'Eighth example'</pre>}>
            <Lorem count={2} seed={7} />
          </Paragraph>
        </Section>

      </Section>

    </Article>
  )
}

export default SolitaireAI;
