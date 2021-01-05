/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

exports.onCreateWebpackConfig = ({ actions }) => {
	actions.setWebpackConfig({
		node: {
			fs: 'empty'
		}
	})
}

// You can delete this file if you're not using it
