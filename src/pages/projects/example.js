import React, { useState, createContext } from "react";
import Lorem from "react-lorem-component";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, GrCirclePlay, AiOutlineMenu } from "react-icons/all";
import ExampleData from "../../../content/projects/example.yaml";
import TOC from "../../components/toc";
import styles from "../../styles/example.module.css";


function Article() {
  console.log(ExampleData)

  return (
    <div className={styles.page}>
      <TOC links={ExampleData.toc.pages} />
      <div className={styles.content}>
        <div className={styles.article}>
          <p>Article Title</p>
          <Paragraph />
          <Paragraph />
          <Paragraph />
        </div>
        <div className={styles.sidebar}>
          Sidebar
        </div>
      </div>
    </div>
  );
}

// function Menu({ links, activeID }) {
//   const [collapsed, setCollapsed] = useState(false);
//
//   function handleToggle() {
//     console.log('EVENT: toggling table of contents')
//     setCollapsed(!collapsed);
//   }
//
//   console.log('links =', links)
//   const menu_links = (
//     <div className={styles.links}>
//       {
//         links.pages.map((link) => {
//           console.log(link)
//           return <div>Menu Item</div>
//         })
//       }
//     </div>
//   )
//
//   return (
//     <div className={styles.menu}>
//       <div className={styles.toggler}>
//         <AiOutlineMenu
//           color   = {'white'}
//           size    = {'24'}
//           onClick = {handleToggle}
//         />
//       </div>
//       { !collapsed ? menu_links : null }
//     </div>
//   )
//
// }
//
// function MenuLink({text, anchor, sections, active}) {
//
// }

function Paragraph(props) {
  const variants = {

  }

  return (
    <motion.div className  = {styles.paragraph}
                whileHover = {{ x : '10px' }}
    >
      <Lorem count={1} />
    </motion.div>
  )
}


export default Article;
