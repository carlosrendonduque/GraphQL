const { ApolloServer, gql}=require('apollo-server');

//server
const server = new ApolloServer();

//start server
server.listen().then((url)=>{
  console.log('Server ready in URL ${url}')
})