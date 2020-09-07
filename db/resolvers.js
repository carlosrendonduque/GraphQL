const User = require('../models/User');
const Microservice = require('../models/Microservice');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')
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

    }

  } 
}

module.exports = resolvers;