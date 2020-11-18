import React, { useEffect, useState, useRef } from "react";
import Typed from "typed.js";
import DiffMatchPatch from "diff-match-patch";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

// region Constants

const diff          = new DiffMatchPatch();
const invisibleChar = '\u2800';

// endregion

function CodeContainer() {
  // A component for easily testing input to the `Code` prop by providing
  // some sample content and a button to toggle through them.

  const [index, setIndex] = React.useState(0);
  const strings = [
    `function foo(x) {
  return x + 1;
}`,
    `function bar(self, y) {
  return y + 1 * 2;
}`,
  ]

  function handleClick() {
    index === strings.length - 1 ?
      setIndex(0) :
      setIndex(index + 1)
  }

  return (
    <div style={{ color: 'white', padding: '50px' }}>

      <button
        onClick={handleClick}
        style={{ margin: '50px' }}>
        Cycle
      </button>

      <Code
        code      = {strings[index]}
        language  = {'language-js'}
        typeSpeed = {50}
        backSpeed = {50}
        spacing   = {50}
      />

    </div>
  )
}

function Code(props) {

  // PROPS
  //  props.code      - the code after changes are made
  //  props.language  - the language to highlight with
  //  props.typeSpeed - how many ms to type each character
  //  props.backSpeed - how many ms to perform a backspace
  //  props.spacing   - how long to pause in between <Typer /> components

  const [prev, setPrev] = useState('');
  const [curr, setCurr] = useState(props.code);

  const differences  = diff.diff_main(prev, curr);
  const typerOptions = getTyperOptions();

  useEffect(() => {
    Prism.highlightAll()
  });

  useEffect(() => {
    setPrev(curr);
    setCurr(props.code);
  }, [props.code]);

  function getTyperOptions() {
    let offset = 0;
    const typeSpeed = props.typeSpeed || 0;
    const backSpeed = props.backSpeed || 0;
    const spacing   = props.spacing   || 0;

    return differences.map((e) => {
      let delay;
      let options;
      const [type, content] = e;
      switch (type) {
        case  0 : {
          delay = 0
          options = {
            typeSpeed  : 0,
            backSpeed  : 0,
            startDelay : 0,
            backDelay  : 0,
          }
          offset += delay + spacing
          break;
        }
        case  1 : {
          delay = content.length * typeSpeed
          options = {
            typeSpeed  : typeSpeed,
            backSpeed  : 0,
            startDelay : offset,
            backDelay  : 0,
          }
          offset += delay + spacing
          break;
        }
        case -1 : {
          delay = content.length * backSpeed
          options = {
            typeSpeed  : 0,
            backSpeed  : backSpeed,
            startDelay : 0,
            backDelay  : offset,
          }
          offset += delay + spacing
          break;
        }
        default : {
          // TODO: Raise an error here
          options = {
            typeSpeed  : 0,
            backSpeed  : 0,
            startDelay : 0,
            backDelay  : 0,
          }
          break;
        }
      }
      return options;
    })
  }

  return (
    <div>
      <h4 style={{ color: 'white' }}>
        Animation
      </h4>

      <pre>
        {
          differences.map((e, index) => {
            const [type, content] = e;
            return (
              <Typer
                {...typerOptions[index]}
                code      = {content}
                operation = {type}
                language  = {props.language}
                key       = {index}
              >
              </Typer>
            )
          })
        }
      </pre>
    </div>
  );

}

function Typer({code, operation, language, typeSpeed, backSpeed, startDelay, backDelay}) {

  // PROPS
  //  code       - the code to be typed
  //  operation  - 0: just display code, 1: insert code, -1: remove code
  //  typeSpeed  - how many ms to type each character
  //  backSpeed  - how many ms to perform a backspace
  //  startDelay – how long to wait in ms before typing
  //  backDelay  – how long to wait in ms before deleting

  const codeRef = useRef(null)

  function getStrings() {
    switch (operation) {
      case  0 : {
        return  [`\`${code}\``]
      }
      case -1 : {
        return  [`\`${code}\``, "``"]
     }
      case  1 : {
        // This is a hack to get around the fact that typed.js automatically
        // trims all strings
        const trimmedCode = code.trimStart();
        const padding     = invisibleChar.repeat(code.length - trimmedCode.length);
        return [`\`\``, padding + trimmedCode];
      }
      default : return [];
    }
  }

  React.useEffect(() => {
    const options = {
      typeSpeed      : typeSpeed  || 0,
      backSpeed      : backSpeed  || 0,
      startDelay     : startDelay || 0,
      backDelay      : backDelay  || 0,
      smartBackspace : true,
      loop           : false,
      showCursor     : false,
      autoInsertCss  : false,
      strings        : getStrings(),
      onStringTyped  : (() => {
        Prism.highlightElement(codeRef.current)
      })
    }
    const typed = new Typed(codeRef.current, options);
    Prism.highlightAll()
    return () => {
      typed.destroy()
    };
  })

  return (<>
    <code
      ref       = {codeRef}
      className = {language}
      style     = {{ display: 'inline' }}
    >
    </code>
  </>)

}


export default CodeContainer;
