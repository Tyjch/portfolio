# Import Format
## Order of Imports
1. Any `react` imports 
2. Default exported components (e.g. `import Lorem from 'react-lorem-component'`)
3. Non-default exported components (e.g. `import { motion } from 'react-motion'`)
4. Imported data (e.g. `import ProjectsData from '../../content/projects.yaml'`) 
5. Stylesheets (e.g. `import styles from '../styles/projects.module.css'`)

## Rules
- Use double quotes over single quotes
- Prefer CSS modules for stylesheets
- Prefer `styles` as the name for the imported CSS module

# Other
- Decouple data from component logic (i.e. don't reference data in `/components/*.js`)
- Order imports from external libraries before those of internal components
- Prefer the `className` attribute first in components
- Likewise, the `key` attribute should be the last
- Components/elements with multiple attributes should have one per line
- List props with a description used by a component in single-line comments at the top of the component declaration
- Prefer semantic elements over non-semantic ones, where applicable
    - `<main>`       –– "Specifies the main content of a document"
    - `<section>`    –- "A section is a thematic grouping of content, typically with a heading"
    - `<article>`    –– "An article specifies independent, self-contained content"
    - `<header>`     –– "Represents a container for introductory content or a set of navigational links"
    - `<footer>`     –– "Defines a footer (copyright, contact info, back to top button, etc.) for a document or section"
    - `<nav>`        –– "Defines a set of navigation links"
    - `<details>`    –– "Defines additional details that the user can view or hide"
    - `<summary>`    –– "Defines a visible heading for an \<details\> element"
    - `<figure>`     –– "Specifies self-contained content, like illustrations, diagrams, photos, code listings, etc."
    - `<figcaption>` –– "Defines a caption for a <figure> element"
  