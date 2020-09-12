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
      licenses: Int
      price: Float
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
    
    type Workflow{
      id: ID!
      workflow:[WorkflowGroup]
      total_microservices: Float
      client: ID
      consultant: ID
      createdat: String
      state: WorkflowState
      
    }

    type WorkflowGroup{
      id: ID
      quantity: Int
      name: String
      price: Float
    }

    type TopClient{
      total: Float
      client: [Client]
    }

    type TopConsultant{
      total: Float
      consultant: [User]
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
      licenses: Int!
      price: Float!
    }
    
    input ClientInput{
      firstname: String!
      lastname: String!
      company: String!
      email: String!
      phone: String
    }

    input WorkflowMicroserviceInput {
      id: ID
      quantity: Int
      name: String
      price: Float
    }

    input WorkflowInput {
      workflow:[WorkflowMicroserviceInput]
      total_microservices: Float
      client: ID
      state: WorkflowState

    }
    enum WorkflowState{
      PENDING
      COMPLETED
      CANCELED
    }


    type Query{
      #Users
      getUser: User
  
      #Microservices
      getMicroservices:[Microservice]
      getMicroservice(id: ID!): Microservice

      #Clients
      getClients : [Client]
      getClientsConsultant : [Client]
      getClient(id: ID!) : Client

      #Workflows
      getWorkflows : [Workflow]
      getWorkflowsConsultant : [Workflow]
      getWorkflow(id: ID!) : Workflow
      getWorkflowsState(state: String!): [Workflow]

      #Advanced queries
      bestClients: [TopClient]
      bestConsultants: [TopConsultant]
      lookMicroservice (text: String!): [Microservice]

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

      #Workflows
      newWorkflow(input: WorkflowInput ): Workflow
      updateWorkflow(id: ID!, input: WorkflowInput) : Workflow
      deleteWorkflow(id: ID!) : String



    }
`;

module.exports = typeDefs;