import React, { useState } from 'react';
import Coder from "./code";
import styles from '../styles/article.module.css';

function Article(props) {

  const [pageIndex, setPageIndex] = useState(0);
  const [code, setCode] = useState({
    language : 'language-js',
    text     : 'console.log("Hello world!");'
  });

  function handleBackward() {
    console.log('Going backward');
    setPageIndex(Math.max(0, pageIndex-1));
  }

  function handleForward() {
    console.log('Going forward');
    setPageIndex(Math.min(pageIndex + 1, props.data.pages.length - 1));
  }

  function handleCodeChange(code) {
    setCode(code);
  }

  const page = props.data.pages[pageIndex];

  return (
    <div className={styles.article}>
      <div className={styles.content}>
        <Title>
          {props.data.title}
        </Title>
        <Page
          title   = {page.page}
          content = {page.content}
          handler = {(c) => handleCodeChange(c)}
        />
        <button onClick={handleBackward}> Back </button>
        <button onClick={handleForward}> Next </button>
      </div>
      <div className={styles.sidebar}>
        <Coder language={code.language} code={code.text} />
      </div>
    </div>
  );
}

function Page({title, content, handler}) {
  return (
    <div>
      <h2 className={styles.title}> {title} </h2>
      {
        content.map((c, i) => {
          switch (c.type) {
            case 'paragraph' : {
              return <Paragraph data={c} handler={handler} key={i} />;
            }
            case 'section' : {
              return <Section data={c} key={i} />;
            }
            default : {
              return <p key={i}>None</p>;
            }
          }
        })
      }
    </div>
  );
}

function Title(props) {
  return (
    <h1 className={styles.title}>
      {props.children}
    </h1>
  );
}

function Section({data}) {
  return (
    <h3 className={styles.title}>
      {data.content}
    </h3>
  );
}

function Paragraph({data, handler}) {
  console.log(data);

  function handleClick() {
    console.log('Paragraph clicked');
    try {
      handler(data.sidebar.code);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <p onClick={handleClick}>
      {data.content}
    </p>
  );

}

export default Article;
