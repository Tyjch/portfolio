import React from "react";
import Article from "../../components/article";
import ArticleData from "../../../content/projects/solitaire-ai.yaml";

// function SomeArticle(props) {
//
//   function handleEnter() {
//     console.log('handleEnter()');
//     // if (codeRef.current !== null) {
//     //   codeRef.current.step();
//     // }
//   }
//
//   const introduction = (<>
//     <h2 className={styles.section}> Introduction </h2>
//     <p className={styles.text}>
//       There have been a few approaches to solving klondike solitaire in the
//       past. They usually assume that the values of hidden cards are known to
//       the player, a form known as thoughtful solitaire. Any game that is
//       solvable in thoughtful solitaire is also solvable in regular solitaire.
//       As as result, research in this area has shown that the solvability of
//       solitaire lies between ~82% and ~91%
//       <cite> (Bjarnason et al.) </cite>
//     </p>
//     <p className={styles.text}>
//       While these bounds are interesting, they rely on the assumption of
//       perfect information (i.e. every card is known). In reality, solitaire
//       is played under uncertainty; you have to consider every permutation of
//       hidden cards and act accordingly. Even with a single deal of solitaire,
//       there are 21! permutations of hidden cards; far too many for a human or
//       computer to calculate.
//     </p>
//     <p className={styles.text}>
//       Deep reinforcement learning solves this problem by training a deep
//       neural network to approximate the value of arbitrary states or actions.
//       Using these networks, we can derive a strategy that generalizes to
//       states that likely have never seen before. Before we get to that point,
//       we have to create an environment that defines the observations, actions,
//       and rewards in solitaire.
//     </p>
//   </>);
//
//   const environment = (<>
//     <h2 className={styles.section}> Environment </h2>
//     <p className={styles.text}>
//       The environment is just a formalism for the thing that the agent
//       interacts with. It outputs an observation of the current state from the
//       players perspective, a reward for their previous action, and a list of
//       legal actions they can make. As input it takes an action and uses it to
//       changes the state before emitting another set of outputs.
//     </p>
//     <p className={styles.text}>
//     </p>
//
//   </>);
//
//   const cards = (<>
//     <h3 className={styles.subsection}> Cards </h3>
//     <p className={styles.text}>
//       Cards are essentially defined by their rank, suit, and whether they are
//       hidden or not. Ranks and suits are members of an enumeration class,
//       <code>RankType</code> and <code>SuitType</code> respectively. Both include
//       <code>kHidden</code> and <code>kNone</code> as members, with the former
//       being used as a placeholder for cards that haven't been revealed yet. The
//       latter is used to represent empty foundation or tableau piles.
//     </p>
//     <p className={styles.text}>
//       It's also helpful to represent cards as integers, which can be calculated
//       from their rank and suit. Since these are set once they are revealed, it
//       makes sense to calculate them only once and then store them in a private
//       field: <code>hidden_</code>. If a card has been revealed, the first call
//       to <code>Card::GetIndex()</code> will calculate and store it; otherwise,
//       the stored value will be returned.
//     </p>
//     <p className={styles.text}>
//       While the location of a card should technically belong to the state,
//       rather than the card itself, in this instance it's helpful to keep it
//       within this class. If it were moved to the state, we would need to lookup
//       the location whenever we wanted to call the <code>Card::LegalChildren()</code>
//       method.
//     </p>
//     <Coder
//       language = {'language-cpp'}
//       code     = {`class Card {
//   public:
//     std::string ToString(bool colored = true) const;
//     std::vector<Card> LegalChildren() const;
//     ...
//   private:
//     bool         hidden_   = false;
//     int          index_    = kHiddenCard;
//     RankType     rank_     = RankType::kHidden;
//     SuitType     suit_     = SuitType::kHidden;
//     LocationType location_ = LocationType::kMissing;
//     `}
//     />
//   </>);
//
//   const support_classes = (<>
//     <h2 className={styles.section}> Support Classes </h2>
//     <p className={styles.text}>
//       Solitaire fundamentally boils down to piles of cards and rules for moving
//       cards between them. So before we get started on the environment, we'll
//       implement some classes that will encapsulate the objects we'll be operating
//       on. While not all environments take the OOP approach, in this case it
//       certainly made it easier to reason about and debug.
//     </p>
//     {cards}
//   </>);
//
//   return (
//     <div className={styles.content}>
//       <h1 className={styles.title}> SOLITAIRE AI </h1>
//       {introduction}
//       {support_classes}
//       {environment}
//     </div>
//   );
// }

function SolitaireAI() {
  return (
    <Article data={ArticleData} />
  );
}

export default SolitaireAI;
