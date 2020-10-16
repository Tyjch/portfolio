import React from "react"
import Typist from 'react-typist'
import TypeIt from "typeit-react"
import Highlight, { defaultProps } from "prism-react-renderer"
import theme from "prism-react-renderer/themes/nightOwl"
// import "react-typist/dist/Typist.css"

// region Hidden



// TODO: What happens when a substring doesn't fully encompass its tokens?
//       e.g ['def', 'func', '(', 'x', ')', ':'] := 'nc(x' -> 'nction(z'
//       Instead of resulting in ['def', 'function('z', ')', ':'],
//       It will yield ['def', 'nction(z', ')', ':'] because it drops all
//       matching tokens.

// endregion
const example = `
  class Foo():
    def __init__(self, bar):
      self.bar = bar
    
    def __repr__(self):
      return f"Foo(bar={self.bar})"
    
    def evaluate(self, z):
      return self.bar + z
`


function getContentArray(line) {
  return line.map(token => token.content)
}

function getContentString(line) {
  return getContentArray(line).join('')
}

function getSubstrIndices(string, substr) {
  // Returns an object containing the first and last indices of `substr`
  // within `string` such that `string.slice(i, j) === substr`

  const first_index = string.indexOf(substr);
  const last_index  = string.lastIndexOf(substr) + 1;
  return { first: first_index, last: last_index };
}

function getTokenIndex(line, index) {
  // Given the index of a character in a string, return the index of the
  // token that it's located within.
  //
  //   01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22
  //   d  e  f     e  v  a  l  u  a  t  e  (  s  e  l  f  ,     z  )  :
  //   0  0  0  1  2  2  2  2  2  2  2  2  3  4  4  4  4  5  6  6  7  8
  //
  //   f(2)  -> 0    ('e' -> 'def')
  //   f(10) -> 2    ('a' -> 'evaluate')
  //   f(19) -> 6    ('z' -> ' z')

  let output;
  let i = 0;

  for (const [tokenIndex, element] of getContentArray(line).entries()) {
    let j = i + element.length;
    if (i <= index && index < j) {
      output = tokenIndex;
      break;
    } else {
      i = j
    }
  }

  return output;
}

function replaceTokens(line, replaceCode, withCode) {

  // Get the string of `line` and find indices of sub-string `replaceCode`
  const string = getContentString(line);
  const substrIndices = getSubstrIndices(string, replaceCode);

  // Find indices of TOKENS that contain sub-string `replaceCode`
  const indices = {
    first : getTokenIndex(line, substrIndices.first),
    last  : getTokenIndex(line, substrIndices.last),
  }

  console.log('string:', string)
  console.log('substrIndices:', substrIndices)

  // Generate a new token to replace one or more tokens containing `replaceCode`
  const replacementToken = {
    types   : ['plain'],
    content : replaceCode,
    replace : {
      replacement : withCode,
      backspace   : replaceCode.length
    }
  }

  // Get the number of tokens to replace
  // If `last` and `first` are the same index, their difference is 0 which is 1 token
  // Likewise a difference of n implies n + 1 tokens
  const deleteCount = indices.last - indices.first + 1

  // This modifies `line` in place, so this function has side effects
  line.splice(indices.first, deleteCount, replacementToken)

}






// region Components

function Token(props) {

  // tokenProps - props passed down from `highlight.getTokenProps()`
  // data - miscellaneous data made in part by me


  console.log(props)

  if (props.data.hasOwnProperty('replace')) {
    return (
      <Typist className={props.className} style={{ display: 'inline' }}>

        <span className={props.className} style={props.style}>
          {props.data.content}
        </span>

        <Typist.Backspace count={props.data.replace.backspace} delay={2000} />

        <span>
          {props.data.replace.replacement}
        </span>

      </Typist>
    )
  }
  else {
    return (
      <span className={props.className} style={props.style}>
        {props.children}
      </span>
    )
  }



}

function CodeLine({code, language, theme, replaceCode, withCode}) {
  return (
    <Highlight {...defaultProps}
               code     = {code}
               language = {language}
               theme    = {theme}
    >
      {highlight => {
        let line = highlight.tokens[0];
        replaceTokens(line, replaceCode, withCode)
        console.log(getContentString(line))

        return (
          <pre className={highlight.className} style={highlight.style}>
            {highlight.tokens.map((line, i) => (
              <span {...highlight.getLineProps({ line, key: i })}>
                {line.map((token, key) => (

                  <Token {...highlight.getTokenProps({token, key})}
                         data  = {token}
                         key   = {key}
                  />

                ))}
              </span>
            ))}
          </pre>
        );
      }}
    </Highlight>
  )

}

function Code(props) {

  // code - the marked up code that we want to display now
  // language - the language to highlight syntax for

  return (
    <CodeLine code={'def evaluate(self, foo):'}
              replaceCode={' foo'}
              withCode={' bar'}
              language={'python'}
              theme={theme}
    />
  )
}

function CodeContainer() {
  return (
    <Code code={example} language={'python'} />
  )
}

// endregion

export default CodeContainer;