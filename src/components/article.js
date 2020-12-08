import React, { useState } from 'react'
import { Link } from "react-scroll"
import { motion, useCycle } from "framer-motion"
import Navigation from "./toc"
import styles from '../styles/article.module.css'

import { Waypoint } from "react-waypoint"
import { BsCircle, AiOutlineMenu } from "react-icons/all"


function Section({ title, id, children }) {
  return (
    <div className={styles.section} id={id}>
      <h2 className={styles.title}> {title} </h2>
      {children}
    </div>
  );
}

// function Navigation({ links }) {
//
//   const [open, cycleOpen] = useCycle('visible', 'hidden');
//
//   const nav_variants  = {
//     visible : { width : 'auto' },
//     hidden  : { width : '50px' },
//   }
//   const link_variants = {
//     visible : {
//       x       : 0,
//       opacity : 1
//     },
//     hidden  : {
//       x       : -100,
//       opacity : 0
//     }
//   }
//
//
//   return (
//     <motion.div
//       className = {styles.navigation}
//       initial   = {'visible'}
//       animate   = {open}
//       variants  = {nav_variants}
//     >
//       <div>
//         <div className={styles.navtoggle}>
//           <AiOutlineMenu onClick={() => cycleOpen()} />
//         </div>
//
//         <motion.div
//           className = {styles.navlinks}
//           initial   = {'hidden'}
//           animate   = {open}
//           variants  = {link_variants}
//         >
//           {
//             links.map(child => {
//               return (
//                 <NavLink
//                   text     = {child.text}
//                   active   = {false}
//                   anchor   = {child.anchor}
//                   key      = {child.anchor}
//                   sections = {
//                     child.hasOwnProperty('sections') ?
//                       child.sections : []
//                   }
//                 />
//               );
//             })
//           }
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// }
//
// function NavLink({ text, anchor, sections }) {
//
//   // PROPS
//   //  text     - the text to display for the link
//   //  anchor   - the id of the element to scroll to when the title is clicked
//   //  active   - indicates whether the corresponding section is being viewed
//   //  sections - the data needed to render child links
//
//   const [collapsed, setCollapsed] = useState(false);
//
//   function toggle() {
//     setCollapsed(!collapsed)
//   }
//
//   const title  = (<>
//     <Link
//       to          = {anchor}
//       activeClass = {styles.active}
//       spy         = {true}
//       smooth      = {true}
//       duration    = {500}
//       offset      = {-20}
//     >
//       <motion.h4
//         className  = {styles.navlink}
//         whileHover = {{ scale: 1.05 }}
//       >
//         {text}
//       </motion.h4>
//     </Link>
//   </>);
//
//   return (
//     <div>
//       {title}
//       {
//         !collapsed && sections ? (
//             <div className={styles.links}>
//               { sections.map(section => <NavLink {...section} key={section.anchor}/>) }
//             </div>
//           ) : null
//       }
//     </div>
//   );
// }

function Article(props) {
  return (
    <div className={styles.page}>
      <Navigation links={props.data.nav.links} />
      <div className={styles.content}>
        <div className={styles.article}> {props.children} </div>
        <div className={styles.sidebar}> Sidebar </div>
      </div>
    </div>
  );
}


export default Article;
export { Section, Navigation };
