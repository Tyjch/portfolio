import React from "react"
import Article, { Paragraph, Section } from "../../components/article"
import Solitaire from '../../components/projects/solitaire'
import Coder from "../../components/code";
import SolitaireAIData from "../../../content/projects/solitaire-ai.yaml"
import Lorem from "react-lorem-component";


function SolitaireAI() {

  const solitaire_example = <Solitaire />
  const summary_of_piles = (
    <Coder
      language = {'language-cpp'}
      code     = {`
class Pile {
  public:
    Pile(LocationType type, PileID id, SuitType suit = SuitType::kNone);
    virtual ~Pile() = default;
    ...
    virtual std::vector<Card> Sources() const;
    virtual std::vector<Card> Targets() const;
    virtual std::vector<Card> Split(Card card);
    virtual void Reveal(Card card_to_reveal);
    void Extend(std::vector<Card> source_cards);
}
      `}
    />
)

  return (
    <Article data={SolitaireAIData}>

      <Section title={'Introduction'} id={'#introduction'}>
        <Paragraph example={solitaire_example}>
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
          <Paragraph example={<pre>'Summary of Piles'</pre>}>
            <p>
              Now that we've defined a <code>Card</code> class, we can develop an abstract base class that
              represents an ordered list of cards. By identifying common attributes and behaviors, we can then
              inherit those in subclasses and specialize the parts as needed.
            </p>
          </Paragraph>
          <Paragraph example={<pre>'Data Members of Piles'</pre>}>
            <p>
              A <code>Pile</code> is essentially just a wrapper around a vector of cards with a couple of methods
              that help determine what actions are available to the agent. Every subclass has cards that can have
              other cards placed on them (<code>Sources</code>) and cards that can be moved (<code>Targets</code>).
              Together, these allow us to determine what actions are available to the agent in a particular state.
            </p>
          </Paragraph>
          <Paragraph example={<pre>'Methods of Piles'</pre>}>
            <p>
              We also need a few methods for manipulating the underlying vector:
              <ul>
                <li><code>Split()</code> removes targets from the <code>Pile</code></li>
                <li><code>Extend()</code> adds sources from another <code>Pile</code></li>
                <li><code>Reveal()</code> <i>"flips"</i> a hidden card, assigning it a suit and rank</li>
              </ul>



            </p>
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
