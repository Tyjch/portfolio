import React, { useEffect, useState } from "react"
import Typed from "typed.js"
import DiffMatchPatch from "diff-match-patch"

const diff = new DiffMatchPatch();


function CodeContainer() {
  const [index, setIndex] = React.useState(0);
  const strings = [
    // `here I am`,
    // `here we am`,
    `def foo(self, x):
      return x + 1`,
    `def foo(y):
      return y + 1 * 2`,
    // `def bar(z):
    //   return z + 1`,
    // `def bar(z):
    //   return z`
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
        code={strings[index]}
        language={'python'}
        typeSpeed = {100}
        backSpeed = {100}
        spacing   = {500}
      />

    </div>
  )
}

function Code(props) {

  // PROPS
  //  props.prev      – the code before changes are made
  //  props.curr      - the code after changes are made
  //  props.typeSpeed - how many ms to type each character
  //  props.backSpeed - how many ms to perform a backspace
  //  props.spacing   - how long to pause in between <Typer /> components

  const [prev, setPrev] = useState('')
  const [curr, setCurr] = useState(props.code)

  const differences  = diff.diff_main(prev, curr);
  const typerOptions = getTyperOptions();

  useEffect(() => {
    setPrev(curr)
    setCurr(props.code)
  }, [props.code])

  function getTyperOptions() {
    let offset = 0;
    const typeSpeed = props.typeSpeed || 0;
    const backSpeed = props.backSpeed || 0;
    const spacing   = props.spacing   || 0;

    return differences.map((e, index) => {
      let delay;
      const [type, content] = e;
      switch (type) {
        case  0 : {
          delay = 0
          const options = {
            typeSpeed  : 0,
            backSpeed  : 0,
            startDelay : 0,
            backDelay  : 0,
          }
          offset += delay + spacing
          return options;
        }
        case  1 : {
          delay = content.length * typeSpeed
          const options = {
            typeSpeed  : typeSpeed,
            backSpeed  : 0,
            startDelay : offset,
            backDelay  : 0,
          }
          offset += delay + spacing
          return options;
        }
        case -1 : {
          delay = content.length * backSpeed
          const options = {
            typeSpeed  : 0,
            backSpeed  : backSpeed,
            startDelay : 0,
            backDelay  : offset,
          }
          offset += delay + spacing
          return options;
        }
      }
    })
  }

  // region misc.

  const prev_vs_curr = (<>
    <h4 style={{ color: 'white' }}>Current Code</h4>
    <pre style={{ color: 'white' }}>
      {curr}
    </pre>
    <h4 style={{ color: 'white' }}>Previous Code</h4>
    <pre style={{ color: 'white' }}>
      {prev}
    </pre>
  </>)
  const diff_display = (<>
    <h4 style={{ color: 'white' }}>Differences</h4>
    <pre>
      {
        differences.map((e, index) => (
          <span key={index} style={{ color: e[0] === 0 ? 'white' : e[0] === 1 ? 'blue' : 'red' }} >
            {e[1]}
          </span>
        ))
      }
    </pre>
  </>)

  // endregion

  const typing = (<>
    <h4 style={{ color: 'white' }}>Animation</h4>
    <pre>
      {
        differences.map((e, index) => {
          const [type, content] = e;
          return (
            <Typer
              {...typerOptions[index]}
              code      = {content}
              operation = {type}
              key       = {index}
            />
          )
        })
      }
    </pre>
  </>)

  return (
    <div>
      {prev_vs_curr}
      {diff_display}
      {typing}
      {console.log('diffs:', differences)}
    </div>
  )
}

function Typer({code, operation, typeSpeed, backSpeed, startDelay, backDelay}) {

  // PROPS
  //  code       - the code to be typed
  //  operation  - 0: just display code, 1: insert code, -1: remove code
  //  typeSpeed  - how many ms to type each character
  //  backSpeed  - how many ms to perform a backspace
  //  startDelay – how long to wait in ms before typing
  //  backDelay  – how long to wait in ms before deleting

  const spanRef = React.useRef(null)

  function getStrings() {
    switch (operation) {
      case  0 : return [`\`${code}\``]
      case  1 : return [`\`\``, code];
      case -1 : return [`\`${code}\``, '``'];
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
      strings        : getStrings(),
    }
    const typed = new Typed(spanRef.current, options);
    return () => {
      typed.destroy()
    };
  })

  return (<>
    <span ref={spanRef} style={{ whitespace: 'pre' }}>
      {/*{operation === 0 ? '' : code}*/}
    </span>
    <pre ref={spanRef} style={{ display: 'inline' }}>
      {console.log(`Typer.code:\n "${code}"`)}
      {console.log('getStrings():', getStrings())}
    </pre>
  </>)
}




export default CodeContainer;