import React from "react"
import { motion } from "framer-motion"
import { getBezierPath, getMarkerEnd } from 'react-flow-renderer';
import styles from '../styles/flow.module.css'


// Midpoint             =>  [ (x_1 + x_2)/2, (y_1 + y_2)/2 ]
// Slope                =>  ( |y_2 - y_1| / |x_2 - x_1| )
// Perpendicular Slope  =>  -1 / m
// Point-Slope Form     =>  y = m(x - x_1) + y_1
// Distance Formula     =>  D = √[ (x_2 - x_1)^2 + (y_2 - y_1)^2 ]
//  ...                 =>  D = sqrt( (px - x)^2 + (py - f(x))^2 )
//  ...                 =>  x = px - sqrt(-f(x)^2 + 2f(x)*py + D^2 - py^2)

/*
function getMidpoint(sourceX, sourceY, targetX, targetY) {
  const midX = (sourceX + targetX) / 2
  const midY = (sourceY + targetY) / 2
  return { x: midX, y: midY }
}

function getSlope(sourceX, sourceY, targetX, targetY) {
  const rise = (Math.abs(targetY - sourceY))
  const run  = (Math.abs(targetX - sourceX))
  return rise / run
}

function getPerpendicularFunction(sourceX, sourceY, targetX, targetY) {
  // Returns a linear function of `x` that satisfies two properties
  // - It is perpendicular to the ray connecting the source and target
  // - It intersects the midpoint, `mid`

  const mid = getMidpoint(sourceX, sourceY, targetX, targetY);
  const slope = getSlope(sourceX, sourceY, targetX, targetY);

  return ((x) => {
    return (-1 / slope) * (x - mid.x) + mid.y
  })
}

function getDistance(sourceX, sourceY, targetX, targetY) {
  return Math.sqrt(Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2))
}

function getQuadraticBezierPath({ sourceX, sourceY, targetX, targetY, offset=0}) {
  const mid  = getMidpoint(sourceX, sourceY, targetX, targetY)
  const func = getPerpendicularFunction(sourceX, sourceY, targetX, targetY)
  return `M${sourceX},${sourceY} Q${midpoint.x}${midpoint.y}  M${sourceX},${sourceY}`
}
*/


function SkillNode(props) {
  return (
    <motion.div className  = {styles.node}
                whileHover = {{ scale: 1.2 }}
                whileTap   = {{ scale: 0.9 }}>
      <motion.h4 className={styles.title}>
        {props.data.label}
      </motion.h4>
    </motion.div>
  )
}


function SkillEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition,
                     targetPosition, style = {}, data, arrowHeadType, markerEndId }) {

  /*
  const [x1, y1] = [0, 0];
  const [x2, y2] = [3, 4];

  const midpoint = getMidpoint(x1, y1, x2, y2)
  const slope    = getSlope(x1, y1, x2, y2)
  const func     = getPerpendicularFunction(x1, y1, x2, y2)

  console.log('Midpoint:', midpoint)
  console.log('Slope:', slope)
  console.log('Inverse Slope:', func)
  */

  // region Template Code
  const edgePath = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

  return (
    <>
      <path id={id}
            style={style}
            className="react-flow__edge-path"
            d={edgePath}
            markerEnd={markerEnd}
      />
    </>
  );
  // endregion
}


export { SkillNode, SkillEdge };
