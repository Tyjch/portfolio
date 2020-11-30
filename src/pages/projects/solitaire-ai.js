import React, { useState, createContext } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import styles from '../../styles/article.module.css'
import Coder from "../../components/code"


const CodeContext = createContext({
  setContext : () => {},
})


function Article(props) {
  const [index, setIndex] = useState(0);
  const [code,  setCode]  = useState('console.log("Article");');
  const [lang,  setLang]  = useState('language-js');

  function decrementIndex() {
    setIndex(Math.max(0, index - 1));
  }

  function incrementIndex() {
    setIndex(Math.min(index + 1, props.pages.length - 1))
  }

  function setContext(lang, text) {
    console.log('setContext called');
    setLang(lang);
    setCode(text);
  }

  const content    = (<>
    <div className={styles.content}>
      <CodeContext.Provider value={{setContext: setContext}}>
        {props.pages[index]}
      </CodeContext.Provider>
    </div>
  </>);
  const sidebar    = (<>
    <div className={styles.sidebar}>
      <Coder language={lang} code={code} />
    </div>
  </>);
  const navigation = (<>
    <div className={styles.navigation}>
      <FaArrowLeft color={'red'} onClick={decrementIndex} />
      <FaArrowRight color={'red'} onClick={incrementIndex} />
    </div>
  </>);

  return (
    <div className={styles.article}>
      {content}
      {sidebar}
      {navigation}
    </div>
  );
}

function Page(props) {
  return (
    <div>
      <h2 className={styles.title}> {props.title} </h2>
      {props.children}
    </div>
  )
}

function Paragraph(props) {

  let lang = ''
  let text = ''
  if (typeof(props.code) !== "undefined") {
    lang = props.code.lang;
    text = props.code.text;
  }

  return (
    <CodeContext.Consumer>
      {({ setContext }) => {
        if (props.code) {
          return (
            <p className = {styles.paragraph}
               onClick   = {() => setContext(lang, text)}>
              {props.children}
            </p>
          )
        } else {
          return (
            <p className = {styles.paragraph}>
              {props.children}
            </p>
          )
        }
      }}
    </CodeContext.Consumer>
  );
}


function SolitaireAI() {
  const pages = [
    (<Page title={'Solitaire AI'}>
        <Paragraph code={{
          lang : 'language-js',
          text : 'console.log("First paragraph");'
        }}>
          There have been a few approaches to solving klondike solitaire in the
          past. They usually assume that the values of hidden cards are known to
          the player, a form known as thoughtful solitaire. Any game that is
          solvable in thoughtful solitaire is also solvable in regular solitaire.
          As as result, research in this area has shown that the solvability of
          solitaire lies between ~82% and ~91% <cite>(Bjarnason et al.)</cite>
        </Paragraph>
        <Paragraph code={{
          lang : 'language-js',
          text : 'console.log("Second paragraph");'
        }}>
          While these bounds are interesting, they rely on the assumption of
          perfect information (i.e. every card is known). In reality, solitaire
          is played under uncertainty; you have to consider every permutation of
          hidden cards and act accordingly. Even with a single deal of solitaire,
          there are 21! permutations of hidden cards; far too many for a human or
          computer to calculate.
        </Paragraph>
        <Paragraph code={{
          lang : 'language-js',
          text : 'console.log("Third paragraph");'
        }}>
          Deep reinforcement learning solves this problem by training a deep
          neural network to approximate the value of arbitrary states or actions.
          Using these networks, we can derive a strategy that generalizes to
          states that likely have never seen before. Before we get to that point,
          we have to create an environment that defines the observations, actions,
          and rewards in solitaire.
        </Paragraph>
    </Page>),
    (<Page title={'Support Classes'}>
        <Paragraph>
          Solitaire fundamentally boils down to piles of cards and rules for moving
          cards between them. So before we get started on the environment, we'll
          implement some classes that will encapsulate the objects we'll be operating
          on. While not all environments take the OOP approach, in this case it
          certainly made it easier to reason about and debug.
        </Paragraph>
        <h3 className={styles.title}> Cards </h3>
        <Paragraph code={{
          lang : 'language-cpp',
          text : `// Main constructor, using rank & suit rather than an index
Card::Card(bool hidden, SuitType suit, RankType rank, LocationType location)
    : rank_(rank), suit_(suit), location_(location), hidden_(hidden) {}
    
// Alternate constructor, converts an index into a rank & suit first
Card::Card(int index, bool hidden, LocationType location)
    : location_(location), hidden_(hidden), index_(index) {...}
`
        }}>
          Cards are essentially defined by their rank and suit (which can be
          represented as an integer) and whether they are hidden or not.
          Although the location of a card within a state should technically
          belong to the <code>SolitaireState</code> class, in this instance
          it's helpful to keep it within this class instead.
        </Paragraph>
        <Paragraph code={{
          lang : 'language-cpp',
          text : `std::vector<Card> Card::LegalChildren() const {
  if (hidden_) {
    return {};
  } else {
    RankType child_rank;
    std::vector<SuitType> child_suits;

    // An empty tableau card can accept a king of any suit
    child_suits.reserve(4);

    switch (location_) {
      case LocationType::kTableau: {...}
      case LocationType::kFoundation: {...}
      default: {
        return {};
      }
    }

    std::vector<Card> legal_children;
    legal_children.reserve(4);

    if (child_suits.empty()) {
      SpielFatalError("child_suits should not be empty");
    }

    for (const auto& child_suit : child_suits) {
      auto child = Card(false, child_suit, child_rank);
      legal_children.push_back(child);
    }

    return legal_children;
  }
  
}`
        }}>
          The <code>Card::LegalChildren()</code> method returns a vector of
          cards that can be placed on top of it, given its location.
          For example, an ace of spades can only have a two of spades placed on
          it if it's in a foundation. Otherwise it has no legal children. From
          this method, we can generate a list of all legal moves that the
          agent can take in this state.
        </Paragraph>
        <h3 className={styles.title}> Piles </h3>
        
    </Page>)
  ]
  return <Article title={'Solitaire AI'} pages={pages} />
}

export default SolitaireAI;
