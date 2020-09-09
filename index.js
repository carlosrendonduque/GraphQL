const {ApolloServer}=require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const connectDB = require('./config/db');

//Connect to Database
connectDB();

//server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ()=>{
    const userId=20;
    return {
      userId
    }
  }

});

//start server
server.listen({ port: process.env.PORT || 4000 }).then( ({url}) => {
  console.log(`Server ready in URL ${url}`)
})