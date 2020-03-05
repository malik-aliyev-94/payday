export default {
    types: `
        type Example {
            text: String!
        }
        extend type Query {
            example: Example!
        }
    `,
    resolvers: {
        Query: {
            example: () => ({text: 'Lorem ipsum dolor'})
        }
    }
}