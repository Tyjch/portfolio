import React from 'react'
import Article from "../components/article"
import ArticleData from '../../content/articles/solitaire-ai.yaml'

function ArticlePage(props) {
  return (
    <Article title={ArticleData[0].title} />
  )
}

export default ArticlePage;