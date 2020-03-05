export default `
type Account {
    id: ID!
    customer: Int!
    accn: String!
    name: String!
    type: String!
    date_of_creation: Int!
    status: Int!
    transactions: [Transaction]
}

extend type Query {
    accounts(type: String!): [Account]
}
extend type Mutation {
    createAccount(name: String!, type: String!): Account
    disableAccount(id: ID!): Account
}
`;