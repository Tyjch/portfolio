import React from 'react'
import Lorem from 'react-lorem-component'
import { Link } from 'gatsby'
import { IoIosArrowBack } from "react-icons/all"
import CodeContainer from './code'
import styles from '../styles/article.module.css'


function Header() {
  return (
    <div className={styles.header}>
      <Link to={'/'}>
        <IoIosArrowBack
          color={'black'}
          size={32}
          style={{
            'margin': '10px'
          }}
        />
      </Link>
    </div>
  );
}

function Section(props) {

  const title = (
    <h2 className={styles.sectionTitle}>
      {props.title}
    </h2>
  );

  const body = (
    <Lorem count={2} />
  );

  return (
    <div className={styles.section}>
      {title}
      {body}
    </div>
  )
}

function Article(props) {

  return (
    <div className={styles.article}>

      <div className={styles.main}>
        <Header />
        <div className={styles.body}>
          <h1 className={styles.title}>
            {props.title}
          </h1>
          <Section title={'Introduction'} />
        </div>
      </div>

      <div className={styles.code}>
        <CodeContainer />
      </div>

    </div>
  )
}






















export default Article;