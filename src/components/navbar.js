import React from 'react'
import { motion } from "framer-motion"
import { Link } from 'react-scroll'

import styles from '../styles/navbar.module.css'


function NavItem(props) {

  // data
  // anchor

  return (
    <Link className={styles.link}
          activeClass={styles.active}
          to={props.anchor}>
      <motion.h1 className={styles.title}>
        {props.title.toUpperCase()}
      </motion.h1>
    </Link>
  )
}

function Navbar(props) {

  // data

  return (
    <motion.div className={styles.navbar}>
      {
        props.data.map((navItem) => (
          <NavItem title={navItem.title}
                   anchor={navItem.anchor}
                   key={navItem.title} />
        ))
      }
    </motion.div>
  )
}


export default Navbar;
export { NavItem };