const {gql}=require('apollo-server');
//Schema
const typeDefs =gql `
    type Query{
      getMicroProcess : String
    }
`;

module.exports = typeDefs;