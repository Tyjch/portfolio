import React from "react"
import { motion } from "framer-motion"
import ReactFlow, { Background, isNode } from "react-flow-renderer"
import { SkillNode, SkillEdge } from "./flow"
import styles from '../styles/skill.module.css'


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
    <motion.div className  = {styles.skill}
                variants   = {variants}
                whileTap   = {{ scale: 0.95 }}
                whileHover = {{ scale: 1.05, marginLeft: '10px' }}
                animate    = {props.id === props.currentSkill ? 'selected' : 'unselected'}
                transition = {{ duration: 0.5 }}
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

  // Hooks

  const [currentNode, setCurrentNode] = React.useState(null);
  const [elements, setElements] = React.useState(getInitialElements());

  // Attributes

  const categories = getCategories();
  const nodeTypes  = {
    skill: SkillNode
  };
  const edgeTypes  = {
    skill: SkillEdge
  }

  // Methods

  function getInitialElements(selectedId=null) {
    const nodes = props.data.map(skill => {
      return ({
        id   : skill.id,
        type : 'skill',
        data : {
          label: skill.id,
          selected: skill.id === selectedId,
        },
        position : {
          x: skill.position.x,
          y: skill.position.y
        },
      })
    });
    const links = props.data.flatMap(source => {
      return source.links.map(target => ({
        id       : source.id + '->' + target,
        source   : source.id,
        target   : target,
        animated : source.id === selectedId || target === selectedId,
        type     : 'skill'
      }))
    });
    return nodes.concat(links);
  }

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

  function updateElements() {
    const newElements = elements.map((element) => {
      try {
        // Handles nodes
        element.data.selected = element.id === currentNode
      } catch {
        // Handles edges
        element.animated = false;
        element.animated = element.source === currentNode || element.target === currentNode;
      }
      return element
    })

    setElements(newElements);
  }

  // Handlers

  function onLoad(reactFlowInstance) {
    reactFlowInstance.fitView();
  }

  function handleElementClick(event, element) {
    if (isNode(element)) {
      setCurrentNode(element.id)
      updateElements()
    }
  }

  function handleClick(id) {
    setCurrentNode(id)
    updateElements()
  }

  return (
    <motion.div className={styles.skillSection}>

      <motion.div className={styles.content}>
        {
          Array.from(categories).map(([key, value]) => (
            <Category title={key}
                      data={value}
                      handler={handleClick}
                      currentSkill={currentNode}
                      key={key}
            />
          ))
        }
      </motion.div>

      <ReactFlow className = {styles.graph}
                 elements  = {elements}
                 nodeTypes = {nodeTypes}
                 edgeTypes = {edgeTypes}

                 paneMoveable      = {false}
                 nodesDraggable    = {true}
                 zoomOnScroll      = {true}
                 zoomOnDoubleClick = {false}
                 nodesConnectable  = {false}
                 snapToGrid        = {false}

                 onLoad            = {onLoad}
                 onElementClick    = {(event, element) => handleElementClick(event, element)}
      >

        <Background variant="dots" gap={50} size={1} />

      </ReactFlow>

    </motion.div>
  )

}


export default SkillSection;