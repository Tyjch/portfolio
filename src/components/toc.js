import React, { useState } from "react";
import { Link as ScrollLink } from 'react-scroll'
import { motion, useCycle } from "framer-motion";
import { AiOutlineMenu, IoMdArrowDropright } from "react-icons/all";
import styles from "../styles/toc.module.css";


function Navigation({ links, selected }) {
  const [isOpen, cycleOpen] = useCycle(false, true);
  const variants = {
    visible : { width : 'auto' },
    hidden  : { width : '0' }
  }

  return (
    <div className={styles.navigation}>
      <div className={styles.button}>
        <AiOutlineMenu
          color   = {'white'}
          size    = {'24'}
          onClick = {() => cycleOpen()}
        />
      </div>
      <motion.div
        initial  = {'visible'}
        animate  = {isOpen ? 'visible' : 'hidden'}
        variants = {variants}
      >
        {
          isOpen ? 'Open' : null
        }
      </motion.div>
    </div>
  )

}

function Link({ text, anchor, selected, sections }) {
  const [isOpen, cycleOpen] = useCycle(false, true);



}


export default Navigation;
