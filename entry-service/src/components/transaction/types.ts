export default `
type Transaction {
    id: ID!
    customer: Int!
    account: Int!
    description: String
    date_of_transaction: String!
    amount: Int!
}

extend type Query {
    transactions(account: ID!): [Transaction]
}
extend type Mutation {
    createTransaction(account: ID!, amount: Int!, description: String): Transaction
}
`;