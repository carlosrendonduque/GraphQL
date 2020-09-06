const {gql}=require('apollo-server');
//Schema
const typeDefs =gql `
    type User{
      id: ID
      firstname: String
      lastname: String
      email: String
      createdat: String
    }
    type Token {
      token: String 
    }
    input UserInput{
      firstname: String!
      lastname: String!
      email: String!
      password: String!
    }

    input AuthenticateInput{
      email: String!
      password: String!
    }
    type Query{
      getUser (token: String!) : User
    }
    type Mutation{
      newUser (input: UserInput): User
      authenticateUser(input: AuthenticateInput): Token
    }
`;

module.exports = typeDefs;