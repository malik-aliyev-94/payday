export default `
type Customer {
    id: ID!
    name: String!
    last_name: String!
    phone: String!
    email: String!
    gender: String!
    date_of_birth: String!
    debitAccounts: [Account],
    creditAccounts: [Account]
}
type AuthPayload {
    token: String
    customer: Customer 
}

extend type Query {
    customers: [Customer]
    customer: Customer
}
extend type Mutation {
    signup(name: String!, last_name: String!, password: String!, email: String!, gender: String!, phone: String!, date_of_birth: String!): AuthPayload
    login(login: String!, password: String!): AuthPayload
}
extend type Subscription {
    customerLogin: Customer!
}
`;