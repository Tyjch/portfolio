import React from "react"
import { Scrollbars } from 'react-custom-scrollbars'
import styles from '../styles/scrollbar.module.css'


function Scrollbar(props) {
  return (
    <Scrollbars className={styles.scrollbar} style={{height: '100%'}}
      renderTrackHorizontal = {props => <div {...props} className={styles.trackHorizontal} />}
      renderTrackVertical   = {props => <div {...props} className={styles.trackVertical} />}
      renderThumbHorizontal = {props => <div {...props} className={styles.thumbHorizontal} />}
      renderThumbVertical   = {props => <div {...props} className={styles.thumbVertical} />}
      renderView            = {props => <div {...props} className={styles.view} />}
    >
      {props.children}
    </Scrollbars>
  )
}


export default Scrollbar;
