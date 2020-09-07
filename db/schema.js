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

    type Microservice{
      id: ID
      name: String
      description: String
      URL: String
      createdat: String
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

    input MicroserviceInput{
      name: String!
      description: String!
      URL: String!
    }

    type Query{
      #Users
      getUser (token: String!) : User
      
      #Microservices
      getMicroservices:[Microservice]
      getMicroservice(id: ID!): Microservice
    }
    type Mutation{
      #Users
      newUser (input: UserInput): User
      authenticateUser(input: AuthenticateInput): Token

      #Microservices
      newMicroservice(input: MicroserviceInput): Microservice
      updateMicroservice(id: ID!, input: MicroserviceInput) : Microservice
      deleteMicroservice(id: ID!) : String

    }
`;

module.exports = typeDefs;