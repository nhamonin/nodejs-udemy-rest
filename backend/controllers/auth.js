import bcrypt from 'bcryptjs';

import { User } from '../models/user.js';

const signup = async (request, reply) => {
  const { email, name, password } = request.body;

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

export { signup };
