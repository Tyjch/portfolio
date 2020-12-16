import React from 'react';
import CytoscapeComponent from "react-cytoscapejs/src/component";
import cytoscape from "cytoscape";
import euler from 'cytoscape-euler';
import SkillsYAML from '../../content/skills.yaml';
import styles from '../styles/graph.module.css';


cytoscape.use(euler);
const layout = {
  name: 'euler',
  springLength: edge => 100,
  springCoeff: edge => 0.0004,
  mass: node => 10,
  gravity: -2.2,
  pull: 0.003,
  theta: 0.5,
  dragCoeff: 0.01,
  movementThreshold: 1,
  timeStep: 20,
  refresh: 10,
  animate: true,
  animationDuration: 3000,
  animationEasing: undefined,
  maxIterations: 10000,
  maxSimulationTime: 10000,
  fit: true,
  padding: 40,
  // boundingBox: { x1: 0, y1:0, w:10, h:500 },
  randomize: true,
}
const nodes = SkillsYAML.map(skill => {
  return {
    data : {
      id          : skill.id,
      category    : skill.category,
      href        : skill.href,
      description : skill.description
    },
    position : {
      x : 0,  //skill.position.x,
      y : 0,  //skill.position.y,
    },
    selected : false,
  }
})
const edges = SkillsYAML.flatMap(source => {
  return source.links.map(target => ({
    data : {
      id       : `${source.id}->${target}`,
      source   : `${source.id}`,
      target   : `${target}`,
    }
  }))
});
const stylesheet = [
  {
    selector: 'node',
    style: {
      "label"        : 'data(id)',

      "shape"        : "round-rectangle",
      "width"        : "label",
      "padding"      : "10px",

      "background-color" : "black",

      "border-width" : "2px",
      "border-color" : "white",
    }
  },
  {
    selector: 'node:selected',
    style: {
      "background-color" : "blue",
    }
  },
  {
    selector: 'label',
    style: {
      "color"       : 'white',
      "font-family" : "Source Sans Pro",
      "text-halign" : "center",
      "text-valign" : "center",
    }
  },
  {
    selector: 'edge',
    style: {
      "curve-style" : "unbundled-bezier",
      "line-color"  : "white",
      "opacity"     : 0.6,
    }
  }
]


class GraphContainer extends React.Component {

  constructor(props) {
    super(props);
    this.onClick = props.onClick.bind(this)
  }

  componentDidMount() {
    this.cy.getElementById(this.props.currentNode).select()

    this.cy.on('tap', (event) => {
      if (event.target === this.cy) {
        this.onClick(undefined)
      }
    })
    this.cy.on('select', 'node', (event) => {
      this.onClick(event.target.id())
    })
    this.cy.on('unselect', 'node', () => {
      this.onClick(undefined);
    })

    // this.cy.on('resize', (event) => {
    //   console.log('EVENT: Cytoscape resized', event)
    //   let layout = this.cy.makeLayout({
    //     name: 'euler'
    //   })
    //   layout.run();
    // })

  }

  componentWillUnmount() {
    this.cy.removeAllListeners();
  }



  render() {
    return (
      <CytoscapeComponent
        className  = {styles.graph}
        cy         = {(cy) => { this.cy = cy }}
        elements   = {nodes.concat(edges)}
        stylesheet = {stylesheet}
        layout     = {layout}
        userPanningEnabled  = {false}
        userZoomingEnabled  = {false}
        zoomingEnabled      = {true}
        boxSelectionEnabled = {false}
      />
    );
  }

}


export default GraphContainer;