import React from "react"
import Article, { Section } from "../../components/article"
import SolitaireAIData from "../../../content/projects/solitaire-ai.yaml"
import Lorem from "react-lorem-component";


function SolitaireAI() {
  return (
    <Article data={SolitaireAIData}>

      <Section title={'Introduction'} id={'#introduction'}>
        <Lorem count={1} seed={0} />
      </Section>

      <Section title={'Support Classes'} id={'#support-classes'}>

        <Lorem count={2} seed={1} />

        <Section title={'Cards'} id={'#cards'}>
          <Lorem count={1} seed={2} />
        </Section>

        <Section title={'Piles'} id={'#piles'}>
          <Lorem count={2} seed={3} />
          <Section title={'Tableaus'} id={'#tableaus'}>
            <Lorem count={2} seed={4} />
          </Section>
          <Section title={'Foundations'} id={'#foundations'}>
            <Lorem count={2} seed={5} />
          </Section>
          <Section title={'Waste'} id={'#waste'}>
            <Lorem count={2} seed={6} />
          </Section>
        </Section>

        <Section title={'Moves'} id={'#moves'}>
          <Lorem count={2} seed={7} />
        </Section>

      </Section>

    </Article>
  )
}

export default SolitaireAI;
