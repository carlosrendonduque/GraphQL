const User = require('../models/User');
const Microservice = require('../models/Microservice');
const Client = require('../models/Client');
const Workflow = require('../models/Workflow');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config({path: 'variables.env'});

const createToken = (user, secret, expiresIn) =>{
  //https://jwt.io/
  const {id,email,firstname, lastname}=user;
  return jwt.sign({id, email, firstname, lastname}, secret,{expiresIn})
}

//Resolvers
const resolvers ={
  Query: {
    getUser: async (_, {token}) => {
      const userId = await jwt.verify(token, process.env.SECRET)
      return userId
    },
    getMicroservices: async()=>{
      try {
        const microservices = await Microservice.find({});
        return microservices;

      } catch (error) {
        console.log(error);
      }
    },
    getMicroservice: async(_,{id})=>{
      //Check if Microservice exists
      const microservice=await Microservice.findById(id);
      if (!microservice){
        throw new Error('Microservice does not exist');
      }
      return microservice;
    },
    getClients: async()=>{
      try {
        const clients = await Client.find({});
        return clients;

      } catch (error) {
        console.log(error);
      }

    },
    getClientsConsultant: async(_, {}, ctx)=>{
      try {
        const clients = await Client.find({consultant: ctx.user.id.toString()});
        return clients;

      } catch (error) {
        console.log(error);
      }

    },
    getClient: async (_, {id}, ctx)=>{
      //Check if Client exists
      const client = await Client.findById(id);
      
      if (!client){
        throw new Error('Client does not exist');
      }
      //Who has created the client
      if (client.consultant.toString() !== ctx.user.id){
        throw new Error('Error with credentials');
      }

      return client;
    },
    getWorkflows: async () => {
      try {
        const workflows = await Workflow.find({});
        return workflows;
        
      } catch (error) {
        console.log(error);
      }
    },
    getWorkflowsConsultant: async(_, {}, ctx)=>{
      try {
        const workflows = await Workflow.find({consultant: ctx.user.id.toString()});
        return workflows;

      } catch (error) {
        console.log(error);
      }
    },
    getWorkflow: async (_, {id}, ctx)=>{
      //Check if Workflow exists
      const workflow = await Workflow.findById(id);
      
      if (!workflow){
        throw new Error('Workflow does not exist');
      }
      //Who has created the workflow
      if (workflow.consultant.toString() !== ctx.user.id){
        throw new Error('Error with credentials');
      }

      return workflow;
    },
    getWorkflowsState: async (_, {state}, ctx)=>{
      
      const workflows = await Workflow.find({consultant: ctx.user.id, state });
   
      return workflows;
    }
    },
  Mutation: {
    newUser: async (_, {input} ) => {
      const {email, password}=input;

      //User registered?
      const userExists = await User.findOne({email});
      
      if (userExists) {
        throw new Error('User already registered');

      }
      //Hash password
      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt);
      //Save to the database
      try {
        //Save to the database
        const user = new  User(input);
        user.save(); //Save
        return user;
      } catch (error) {
        console.log(error);
      }
    },
    authenticateUser: async (_, {input}) => {

      const {email, password} = input;
      // User exists?
      const userExists = await User.findOne({email});
      if (!userExists) {
        throw new Error('User does not exist');
      }
      //Password is correct?
       const passwordCorrect = await bcryptjs.compare(password, userExists.password)
       if(!passwordCorrect){
     
         throw new Error('Incorrect password');

       } 
 
      //Create token
       return {
         token: createToken(userExists, process.env.SECRET, '24h')
       }

    },

    newMicroservice: async (_, {input} ) => {
      try {
        const microservice = new Microservice(input);

        //Save to DB
        const result = await microservice.save();
        return result;

      } catch (error) {
        console.log(error);
      }

    },

    updateMicroservice: async(_,{id, input})=>{
       //Check if Microservice exists
       let microservice=await Microservice.findById(id);
       if (!microservice){
         throw new Error('Microservice does not exist');
       }
       //Save to database
       microservice = await Microservice.findOneAndUpdate({_id: id}, input, {new: true});
       return microservice;
    },
    deleteMicroservice: async(_,{id})=>{
      let microservice=await Microservice.findById(id);
       if (!microservice){
         throw new Error('Microservice does not exist');
       }
       //Delete
       await Microservice.findOneAndDelete({_id: id});
       return "Microservice deleted";

    },
    newClient: async (_, {input}, ctx)=>{
      
      console.log(ctx);
      const{email}=input
      //Check if client exists
      //console.log(input);
      const clientExists = await Client.findOne({email});
      
      if (clientExists){
        throw new Error('This client is already registered');
      }
      

      const newClient = new Client(input);

      //Assign consultant
      newClient.consultant =ctx.user.id;

      //Save to the database
      try {
        
        const result = await newClient.save();

        return result;
      } catch (error) {
        console.log(error);
      }
      
    
    },
    updateClient: async(_, {id, input}, ctx)=>{
      //Check if Clients exists
      let client=await Client.findById(id);
      if (!client){
        throw new Error('Client does not exist');
      }
      //Check if the correct consultant is editing
      if (client.consultant.toString() !== ctx.user.id){
        throw new Error('Error with credentials');
      }
      //Save to database
      client = await Client.findOneAndUpdate({_id: id}, input, {new: true});
      return client;
    },
    deleteClient: async(_,{id}, ctx)=>{
      let client=await Client.findById(id);
       if (!client){
         throw new Error('Client does not exist');
       }
       //Check if current user can delete this client
      if (client.consultant.toString() !== ctx.user.id){
        throw new Error('Error with credentials');
      }

       //Delete
       await Client.findOneAndDelete({_id: id});
       return "Client deleted";

    },
    newWorkflow: async (_, {input}, ctx) => {
      
      const { client } = input
      //Check if client exists
      let clientExists=await Client.findById(client);
      if (!clientExists){
         throw new Error('Client does not exist');
       }

      //Check if client belongs to Consultant
      if (clientExists.consultant.toString() !== ctx.user.id){
        throw new Error('Error with credentials');
      }
      //Check stock
      for await(const  microservice_article of input.workflow) {
        const {id} = microservice_article;
        const microservice = await Microservice.findById(id);
        if (microservice_article.quantity > microservice.licenses){
          throw new Error(`The microservice : ${microservice.name} exceeds the number of available licenses`);  
        } else{
          //subtract quantity from available
          microservice.licenses=microservice.licenses-microservice_article.quantity;
          await microservice.save();
        }

      }

      //Create new workflow
      const newWorkflow = new Workflow(input);


      //Assign consutat
      newWorkflow.consultant=ctx.user.id;

      //Save to database
      const result = await newWorkflow.save();
      return result;

    },
    updateWorkflow: async(_, {id, input}, ctx)=>{
      
      const { client } = input

      //Check if Workflow exists
      let workflowExists=await Workflow.findById(id);
      if (!workflowExists){
        throw new Error('Workflow does not exist');
      }

      //Check if Client exists
      let clientExists=await Client.findById(client);
      if (!clientExists){
         throw new Error('Client does not exist');
       }

      //Check if the correct consultant is editing
      if (clientExists.consultant.toString() !== ctx.user.id){
        throw new Error('Error with credentials');
      }

      //Check stock
      if (input.workflow){
        for await(const  microservice_article of input.workflow) {
          const {id} = microservice_article;
          const microservice = await Microservice.findById(id);
          if (microservice_article.quantity > microservice.licenses){
            throw new Error(`The microservice : ${microservice.name} exceeds the number of available licenses`);  
          } else{
            //subtract quantity from available
            microservice.licenses=microservice.licenses-microservice_article.quantity;
            await microservice.save();
          }
  
        }
      }

      //Save to database
      const result =  await Workflow.findOneAndUpdate({_id: id}, input, {new: true});
      return result;
    },
    deleteWorkflow: async(_,{id}, ctx)=>{

      //Check if Workflow exists
      const workflow=await Workflow.findById(id);
      if (!workflow){
        throw new Error('Workflow does not exist');
      }
      //Check if the correct consultant is editing
      if (workflow.consultant.toString() !== ctx.user.id){
        throw new Error('Error with credentials');
      }

       //Delete
       await Workflow.findOneAndDelete({_id: id});
       return "Workflow deleted";

    }

  } 
}

module.exports = resolvers;