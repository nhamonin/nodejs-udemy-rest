export const userSchema = {
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: {
        type: 'string',
        minLength: 6,
        maxLength: 70,
      },
      name: { type: 'string', minLength: 3, maxLength: 20 },
    },
    required: ['email', 'password', 'name'],
  },
};
