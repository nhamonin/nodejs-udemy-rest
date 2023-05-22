import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../models/user.js';

const signup = async (request, reply) => {
  const { email, name, password } = request.body;

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    reply.code(409);
    throw new Error('User already exists!');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    email: email,
    password: hashedPassword,
    name: name,
  });

  await user.save();

  reply.code(201);
  reply.log.info('User created successfully!');
  return {
    message: 'User created successfully!',
    userId: user._id,
  };
};

const login = async (request, reply) => {
  const { email, password } = request.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    reply.code(401);
    throw new Error('User does not exist!');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    reply.code(401);
    throw new Error('Password is incorrect!');
  }

  const token = jwt.sign(
    {
      email: user.email,
      userId: user._id.toString(),
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  reply.code(200);
  reply.log.info('User logged in successfully!');
  return {
    token: token,
    userId: user._id,
  };
};

export { signup, login };
