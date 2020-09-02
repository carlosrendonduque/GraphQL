const {gql}=require('apollo-server');
//Schema
const typeDefs =gql `
    type Workflow{
      name: String
      description: String
    }
    type MicroProcess {
      microprocess: String
    }
    type Query{
      getWorkflows :  [Workflow]
      getMicroProcess:[MicroProcess]
    }
`;

module.exports = typeDefs;