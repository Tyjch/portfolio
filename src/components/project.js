import React from 'react'
import Lorem from "react-lorem-component"
import { Link } from 'gatsby'
import { motion } from "framer-motion"
import { Waypoint } from "react-waypoint"
import { Element } from 'react-scroll'
import { VscGithub } from "react-icons/vsc"
import styles from '../styles/projects.module.css'


function Project(props) {

  // title - the title of the project
  // href  - an external link to github
  // link  - a link to the project page
  // tags  - relevant technologies used

  function handleEnter() {
    console.log("Entered waypoint")
  }

  function handleLeave() {
    console.log("Leaving waypoint")
  }

  return (
    <Waypoint
      onEnter={() => handleEnter}
      onLeave={() => handleLeave}
    >

      <Link to={props.link}>
        <motion.div className={styles.project}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}>

            <motion.h2 className={styles.title}>
              <motion.a className={styles.github}
                        href={props.href}
                        target="_blank"
                        rel="noopener noreferrer">
                <VscGithub />
              </motion.a>
              {props.title.toUpperCase()}
            </motion.h2>

            <motion.div className={styles.tags}>
              {
                props.tags.map((tag) => (
                  <motion.h3 className={styles.tag} key={tag}>
                    {tag.toLowerCase()}
                  </motion.h3>
                ))
              }
            </motion.div>

            <motion.div className={styles.body}>
              {props.children}
            </motion.div>

        </motion.div>

      </Link>

    </Waypoint>
  )
}

function Projects(props) {

  // data - a list of project objects, see content/projects.yaml

  return (
    <div>
      <motion.div className={styles.projects}>
        <Element id={"projects"} name={"projects"}>
          {
            props.data.map((project) => (
              <Project title = {project.title}
                       href  = {project.href}
                       link  = {project.link}
                       tags  = {project.tags}
                       key   = {project.title}
              >
                <Lorem count={1} />
              </Project>
            ))
          }
        </Element>
      </motion.div>
    </div>
  )
}


export { Project };
export default Projects;
