import React from "react"
import { Element } from 'react-scroll'
import Navbar from '../components/navbar'
import About from "../components/about"
import Projects from "../components/project"
import SkillSection from "../components/skill"
import NavbarData from '../../content/navbar.yaml'
import ProjectsData from '../../content/projects.yaml'
import SkillsData from '../../content/skills.yaml'
import AboutData from '../../content/about.yaml'
import '../styles/global.css'


function Index() {

  const navbar   = (
    <Navbar data={NavbarData} />
  );

  const about = (
    <Element name={'about'}>
      <About data={AboutData} />
    </Element>
  )

  const projects = (
    <Element name={'projects'}>
      <Projects data={ProjectsData} />
    </Element>
  );

  const skills   = (
    <Element name={'skills'}>
      <SkillSection data={SkillsData} />
    </Element>
  );

  return (
      <div className={'index'}>
        {navbar}
        {about}
        <div className={'body'}>
          {projects}
          {skills}
        </div>
      </div>
  )
}


export default Index;