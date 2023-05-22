import { User } from '../models/user.js';

const signup = async (request, reply) => {
  const { email, name, password } = request.body;

  const user = new User({
    email: email.value,
    password: password.value,
    name: name.value,
    status: 'I am new!',
  });

  await user.save();

  reply.code(201);
  reply.log.info('User created successfully!');
  return {
    message: 'User created successfully!',
    user,
  };
};

export { signup };
