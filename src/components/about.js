import React from 'react'
import { Link } from 'react-scroll'
import { BsChevronDown } from "react-icons/all"
import { motion } from 'framer-motion'
import styles from '../styles/about.module.css'


function About(props) {

  // data

  return (
    <div className={styles.about}>

      <div className={styles.content}>

        <motion.h1 className={styles.title}
          animate={{ opacity: [0, 1.0] }}>
          Hi, I'm {props.data.name.first} {props.data.name.last}
        </motion.h1>

        <motion.h2 className={styles.subtitle}
          animate={{ opacity: [0, 1.0] }}
          transition={{ delay: 1.0 }}>
          I'm a {props.data.role}
        </motion.h2>

      </div>

      <Link
        className={styles.seeMore}
        to={'projects'}
        smooth={true}
        duration={500}
        offset={-100}
      >
        <motion.div
          className={styles.arrow}
          whileHover={{ scale: 1.2 }}
          animate={{
            y: ['0px', '10px'],
          }}
          transition={{
            yoyo: Infinity,
            duration: 0.7,
          }}
        >
          <BsChevronDown className={styles.arrowIcon} size={32} />
        </motion.div>
      </Link>

    </div>
  );

}


export default About;