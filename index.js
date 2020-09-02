const {ApolloServer}=require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers')


//server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ()=>{
    const myContext ="Hi World!";
    return {
      myContext
    }
  }

});

//start server
server.listen({ port: process.env.PORT || 4005 }).then( ({url}) => {
  console.log(`Server ready in URL ${url}`)
})