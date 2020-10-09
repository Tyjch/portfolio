import React from "react"
import Projects from "../components/project"
import SkillSection from "../components/skill"
import ProjectsData from '../../content/projects.yaml'
import SkillsData from '../../content/skills.yaml'
import '../styles/global.css'


// import { Waypoint } from "react-waypoint"
// import Navbar from "../components/navbar"
// import NavbarData from '../../content/navbar.yaml'


function Index() {

  /*function onEnter() {
    console.log("Entered waypoint");
  }

  function onLeave() {
    console.log("Leaving waypoint");
  }

  const navbar   = <Navbar data={NavbarData} />;*/

  const projects = <Projects data={ProjectsData} />;
  const skills   = <SkillSection data={SkillsData} />;

  return (
      <div>
          {projects}
          {skills}
      </div>
  )
}


export default Index;