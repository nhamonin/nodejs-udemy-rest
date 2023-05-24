import bcrypt from 'bcryptjs';

import { User } from '../models/user.js';

const resolvers = {
  Query: {
    hello: () => {
      return {
        text: 'Hello World!',
        views: 123,
      };
    },
  },
  Mutation: {
    createUser: async (_, args, req) => {
      console.log(args);
      const existingUser = await User.findOne({ email: args.userInput.email });

      if (existingUser) {
        const error = new Error('User exists already!');
        throw error;
      }

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        name: args.userInput.name,
        password: hashedPassword,
      });
      const createdUser = await user.save();

      return { ...createdUser._doc, _id: createdUser._id.toString() };
    },
  },
};

export default resolvers;
