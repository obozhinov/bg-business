const path = require(`path`)
const axios = require("axios")
const _ = require("lodash")

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return graphql(`
    {
      allItem {
        edges {
          node {
            id
            name
            logoURL
            description
            address
            phone
            website
            tags
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const items = result.data.allItem.edges

    // items.forEach(edge => {
    //   const id = edge.node.id
    //   const name = edge.node.name
    //   const businessPath = `/business/${_.kebabCase(name)}/`

    //   createPage({
    //     path: businessPath,
    //     component: path.resolve(`src/templates/single-item.js`),
    //     context: {
    //       itemId: id,
    //     },
    //   })
    // })

    // Tag pages:
    let tags = []

    items.forEach(item => {
      if (item.node.tags.length > -1) {
        tags = tags.concat(item.node.tags)
      }
    })

    tags = _.uniq(tags)

    tags.forEach(tag => {
      const tagPath = `/tag/${_.kebabCase(tag)}/`

      createPage({
        path: tagPath,
        component: path.resolve(`src/templates/single-tag.js`),
        context: {
          tag,
        },
      })
    })
  })
}

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode } = actions

  const fetchFormItems = () =>
    axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/1F7awh105dzhsj2XlrGW-SE4DxmXItbYLgISycjI0yd8/values:batchGet?majorDimension=ROWS&ranges=H1%3AH2&key=AIzaSyA0KQcX1bnbsOiR5eG6za-og3ulqesx-QI`
    )

  const response = await fetchFormItems()

  const arrayOfItems = response.data.valueRanges[0].values

  let rows = []
  for (var i = 1; i < arrayOfItems.length; i++) {
    var rowObject = {}
    for (var j = 0; j < arrayOfItems[i].length; j++) {
      rowObject[arrayOfItems[0][j]] = arrayOfItems[i][j]
    }
    rows.push(rowObject)
  }

  let itemsArrayWithTagsArray = rows.map(function(item) {
    item.tags = item.tags.split(",").map(item => item.trim())
    item = { ...item }
    return item
  })

  itemsArrayWithTagsArray.map((item, i) => {
    const itemNode = {
      id: createNodeId(`${i}`),
      parent: `__SOURCE__`,
      internal: {
        type: `item`, // name of the graphQL query --> allItem {}
        contentDigest: createContentDigest(item),
      },
      children: [],
      name: item.name,
      logoURL: item.logoURL,
      description: item.description,
      address: item.address,
      phone: item.phone,
      website: item.website,
      tags: item.tags,
    }

    createNode(itemNode)
  })
}
