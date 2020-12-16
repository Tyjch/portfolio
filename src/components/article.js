import React, { useState } from 'react'
import { Link } from "react-scroll"
import { motion, useCycle } from "framer-motion"
import { Waypoint } from "react-waypoint"
import SelectionContext from "./selection";
import Navigation from "./toc"
import styles from '../styles/article.module.css'


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

  function updateSelection(newSelection) {
    // console.log(`EVENT: Updated selection to`, newSelection);
    setSelection(newSelection);
  }

  return (
    <div className={styles.page}>
      <SelectionContext.Provider value={{ selection : selection, setSelection : updateSelection }}>
        <Navigation links={props.data.nav.links} selected={selection} />
        <div className={styles.content}>
          <div className={styles.article}> {props.children} </div>
          <div className={styles.sidebar}> Sidebar </div>
        </div>
      </SelectionContext.Provider>
    </div>
  );
}


export default Article;
export { Section, Navigation };
