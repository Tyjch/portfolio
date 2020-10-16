import React from 'react'
import { ImCodepen} from "react-icons/all"
import { motion } from "framer-motion"
import { Link } from 'react-scroll'
import styles from '../styles/navbar.module.css'


function Logo() {
  return (
    <motion.div className={styles.logo}>
      <ImCodepen />
    </motion.div>
  );
}

function NavItem(props) {

  // data
  // anchor

  return (
    <Link className = {styles.navItem}
      to            = {props.anchor}
      activeClass   = {styles.active}
      spy           = {true}
      smooth        = {true}
      duration      = {500}
      offset        = {props.offset || -100}
    >
      <motion.p className = {styles.title}
        whileHover = {{ scale: 1.1 }}
        whileTap   = {{ scale: 0.9 }}>
        {props.title.toUpperCase()}
      </motion.p>

    </Link>
  );
}

function Navbar(props) {

  // data

  return (
    <motion.div className={styles.navbar}>
      <div className={styles.content}>

        <Logo />

        <motion.div className={styles.navItems}>
          {
            props.data.map((navItem) => (
              <NavItem title={navItem.title}
                       anchor={navItem.anchor}
                       offset={navItem.offset}
                       key={navItem.title} />
            ))
          }
        </motion.div>

      </div>
    </motion.div>
  );
}


export default Navbar;
export { NavItem };