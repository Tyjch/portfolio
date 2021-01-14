import React, { useState } from 'react'
import { motion } from "framer-motion"
import { Waypoint } from "react-waypoint"
import SelectionContext from "./selection"
import SidebarContext from "./sidebar"
import Navigation from "./toc"
import styles from '../styles/article.module.css'

function Paragraph({ example, onEnter, children }) {

  const [isActive, setActive] = useState(false);
  const variants = {
    'inactive' : {
      x               : 0,
      opacity         : 0.5,
      color           : '#eee',
      borderLeftStyle : 'none',
    },
    'active'   : {
      x               : '10px',
      opacity         : 1.0,
      color           : '#fff',
      borderLeftStyle : 'solid',
      borderLeftWidth : '2px',
      borderLeftColor : '#fff',
    }
  }

  function handleEnter() {
    setActive(true);
  }

  function handleLeave() {
    setActive(false);
  }

  return (
    <SidebarContext.Consumer>
      {
        ({content, setContent}) => (
          <Waypoint
            topOffset    = {'20%'}
            bottomOffset = {'90%'}
            onEnter = {() => {
              handleEnter();
              try {
                setContent(example);
              } catch (e) {
                setContent(content);
              }
              
              // if (typeof(onEnter) === 'function') {
              //   onEnter(content);
              // }
            }}
            onLeave = {() => {
              handleLeave();
            }}
          >
            <motion.div
              animate  = {isActive ? 'active' : 'inactive'}
              variants = {variants}
              style    = {{ paddingLeft : '10px' }}
            >
              {children}
            </motion.div>
          </Waypoint>
        )
      }
    </SidebarContext.Consumer>
  )
}

function Section({ title, id, children }) {
  return (
    <SelectionContext.Consumer>
      {
        ({selection, setSelection}) => (
          <div className={styles.section} id={id}>
            <Waypoint
              onEnter      = {() => setSelection(id)}
              topOffset    = {0}
              bottomOffset = {'75%'}
            />
            <h2 className={styles.title}> {title} </h2>
            {children}
          </div>
        )
      }
    </SelectionContext.Consumer>
  );
}

function Article(props) {
  const [selection, setSelection] = useState(null);
  const [content, setContent]     = useState(null);

  function updateSelection(newSelection) {
    setSelection(newSelection);
  }

  function updateContent(newContent) {
    try {
      setContent(newContent);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className={styles.page}>
      <SelectionContext.Provider value={{ selection : selection, setSelection : updateSelection }}>
        <Navigation links={props.data.nav.links} selected={selection} />
        <div className={styles.content}>
          <SidebarContext.Provider value={{ content : content , setContent : updateContent }}>
            <div className={styles.article}> {props.children} </div>
            <motion.div className={styles.sidebar}>
                <motion.div className={styles.sidebarContent}>
                    {content}
                </motion.div>
            </motion.div>
          </SidebarContext.Provider>
        </div>
      </SelectionContext.Provider>
    </div>
  );
}


export default Article;
export { Paragraph, Section, Navigation };
