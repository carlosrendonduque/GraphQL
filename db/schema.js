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

    type Client{
      id: ID
      firstname: String
      lastname: String
      company: String
      email: String
      phone: String
      consultant:  ID
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
    
    input ClientInput{
      firstname: String!
      lastname: String!
      company: String!
      email: String!
      phone: String
    }

    type Query{
      #Users
      getUser (token: String!) : User
      
      #Microservices
      getMicroservices:[Microservice]
      getMicroservice(id: ID!): Microservice

      #Clients
      getClients : [Client]
      getClientsConsultant : [Client]
      getClient(id: ID!) : Client
    }
    type Mutation{
      #Users
      newUser (input: UserInput): User
      authenticateUser(input: AuthenticateInput): Token

      #Microservices
      newMicroservice(input: MicroserviceInput): Microservice
      updateMicroservice(id: ID!, input: MicroserviceInput) : Microservice
      deleteMicroservice(id: ID!) : String

      #Clients
      newClient(input: ClientInput ) : Client
      updateClient(id: ID!, input: ClientInput) : Client
      deleteClient(id: ID!) : String


    }
`;

module.exports = typeDefs;