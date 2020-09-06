const User = require('../models/User');
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

    }

  } 
}

module.exports = resolvers;