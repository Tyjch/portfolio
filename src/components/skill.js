import React, { useState, useRef } from "react"
import { motion } from "framer-motion"
import GraphContainer from "./graph"
import styles from "../styles/skill.module.css"


function Category(props) {

  // title        - the title of the category to display as a header
  // data         - a list of skill data to render as <Skill /> elements
  // currentSkill - the current skill selected in <SkillSection />
  // handler      - handles clicks on skills

  return (
    <motion.div className={styles.category}>
      <motion.h2 className={styles.title}>
        {props.title.toUpperCase()}
      </motion.h2>
      <motion.div className={styles.skills}>
        {
          props.data.map(skill => (
            <Skill id={skill.id}
                   href={skill.href}
                   description={skill.description}
                   currentSkill={props.currentSkill}
                   handler={props.handler}
                   key={skill.id}
            />
          ))
        }
      </motion.div>
    </motion.div>
  )
}

function Skill(props) {

  // id
  // href
  // description
  // currentSkill

  const variants = {
    unselected : {
      opacity: 0.6
    },
    selected : {
      opacity: 1
    }
  }

  return (
    <motion.div
      className  = {styles.skill}
      variants   = {variants}
      whileTap   = {{ scale: 0.95 }}
      whileHover = {{ scale: 1.10 }}
      animate    = {props.id === props.currentSkill ? 'selected' : 'unselected'}
      transition = {{ duration: 0.2 }}
      onClick    = {(e) => props.handler(props.id, e)}>

      <motion.a className = {styles.skillTitle}
                href      = {props.href}>
        {props.id}
      </motion.a>

      <motion.p className = {styles.skillBody}>
        {props.description}
      </motion.p>

    </motion.div>
  )
}

function SkillSection(props) {

  const [currentNode, setCurrentNode] = useState(null);
  const cyRef = useRef();

  const categories = getCategories();

  function getCategories() {
    let categories = new Map(
      props.data.map(skill => {
        return [skill.category, []]
      })
    );

    props.data.forEach(skill => {
      categories.get(skill.category).push(skill)
    });

    return categories;
  }

  function handleSkillClick(id) {
    // Triggered when a skill in a category is clicked
    // console.log('EVENT: Clicked skill:', id);
    cyRef.current.cy.getElementById(currentNode).unselect()
    cyRef.current.cy.getElementById(id).select()
    setCurrentNode(id);
  }

  function handleNodeClick(id) {
    // Triggered when a node in the graph is clicked
    // console.log('EVENT: Clicked node:', id);
    setCurrentNode(id);
  }

  return (
    <motion.div className={styles.skillSection}>

      <motion.div className={styles.content} id={'Skills'}>
        {
          Array.from(categories).map(([key, value]) => (
            <Category title={key}
                      data={value}
                      handler={handleSkillClick}
                      currentSkill={currentNode}
                      key={key}
            />
          ))
        }
      </motion.div>

      <GraphContainer
        onClick={handleNodeClick}
        currentNode={currentNode}
        ref={cyRef}
      />

      {console.log('Current Node:', currentNode)}

    </motion.div>
  );

}


export default SkillSection;