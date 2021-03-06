import React from "react";
import { Link as ScrollLink } from 'react-scroll'
import { motion, useCycle } from "framer-motion";
import { AiOutlineMenu } from "react-icons/all";
import styles from "../styles/toc.module.css";


function Navigation({ links, selected }) {
  const [isOpen, cycleOpen] = useCycle(true, false);
  const variants = {
    visible : {
      width      : '150px',
      transition : {
        when : 'beforeChildren',
        staggerChildren  : 0.05,
        staggerDirection : 1
      }
    },
    hidden  : {
      width      : 0,
      transition : {
        when : 'afterChildren',
        staggerChildren  : 0.05,
        staggerDirection : -1,
      }
    }
  }

  return (
    <div className={styles.navigation}>
      <div className={styles.content}>
        <div className={styles.button}>
          <AiOutlineMenu
            color   = {'white'}
            size    = {'24'}
            onClick = {() => cycleOpen()}
          />
        </div>
        <motion.div
          className = {styles.links}
          initial   = {'visible'}
          animate   = {isOpen ? 'visible' : 'hidden'}
          variants  = {variants}
        >
          {
            links.map(child => (
              <Link
                text     = {child.text}
                selected = {selected}
                anchor   = {child.anchor}
                key      = {child.anchor}
                sections = {child.hasOwnProperty('sections') ? child.sections : []}
              />
            ))
          }
        </motion.div>
      </div>
    </div>
  );
}

function Link({ text, anchor, selected, sections }) {
  // TODO: Is it okay to remove `CycleOpen` from this unpacking?
  const [isOpen, ] = useCycle(true, false);

  const variants = {
    visible : { opacity : 1 },
    hidden  : { opacity : 0 },
  }

  const title = (<>
    <ScrollLink
      to          = {anchor}
      smooth      = {true}
      duration    = {500}
      offset      = {-20}
    >
      <motion.h4
        className  = {styles.link}
        initial    = {false}
        variants   = {variants}
        whileHover = {{ scale : 1.05 }}
        style      = {{
          color      : anchor === selected ? '#fff' : '#eee',
          fontWeight : anchor === selected ? 'bold' : 'normal'
        }}
      >
        {text}
      </motion.h4>
    </ScrollLink>
  </>);
  const links = (<>
    {
      isOpen && sections ? (
        <div className={styles.sublinks}>
          { sections.map(section => (
              <Link
                {...section}
                selected = {selected}
                key      = {section.anchor}
              />
            )
          )}
        </div>
      ) : null
    }
  </>);

  return (
    <div>
      {title}
      {links}
    </div>
  );
}


export default Navigation;
