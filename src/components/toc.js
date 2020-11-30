import React, { useState } from "react";
import { Link } from 'react-scroll'
import { motion, useCycle } from "framer-motion";
import { AiOutlineMenu } from "react-icons/ai";
import styles from "../styles/toc.module.css";

function TOC({ links, activeID }) {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const variants = {
    open   : {
      x               : 0,
      opacity         : 1,
      backgroundColor : 'white',
      transition      : {
        type: "spring",
        stiffness: 20,
        restDelta: 2
      }
    },
    closed : {
      x               : '-100%',
      opacity         : 0,
      backgroundColor : 'black',
      transition      : {
        delay: 0.5,
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  console.log('links = ', links);

  const toc_links = (
    <motion.div className={styles.links}>

    </motion.div>
  )

  return (
    <motion.nav
      initial  = {false}
      animate  = {isOpen ? "open" : "closed"}
      variants = {variants}
    >
      <AiOutlineMenu
        color   = {'white'}
        size    = {'24px'}
        onClick = {() => toggleOpen()}
      />

    </motion.nav>
  );
}

function TOCLink({text, anchor, sections, active}) {

  const variants = {
    active   : {
      color : 'white'
    },
    inactive : {
      color : 'gray'
    }
  }

  return (
    <Link
      className = {styles.link}
      to        = {anchor}
      spy       = {true}
      smooth    = {true}
      duration  = {500}
    >
      <motion.p>


      </motion.p>
    </Link>
  );
}

export default TOC;
