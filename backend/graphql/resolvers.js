import validator from 'validator';
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
      const errors = [];
      if (!validator.isEmail(args.userInput.email)) {
        errors.push({ message: 'E-Mail is invalid.' });
      }
      if (
        validator.isEmpty(args.userInput.password) ||
        !validator.isLength(args.userInput.password, { min: 5 })
      ) {
        errors.push({ message: 'Password too short!' });
      }
      if (errors.length > 0) {
        const error = new Error('Invalid input.');
        error.extensions = {
          errors: errors.map((err) => ({ message: err.message })),
        };
        throw error;
      }
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
