export const userSchema = {
  body: {
    type: 'object',
    properties: {
      email: {
        type: 'object',
        properties: {
          value: { type: 'string', format: 'email' },
        },
      },
      password: {
        type: 'object',
        properties: {
          value: {
            type: 'string',
            minLength: 6,
            maxLength: 20,
            pattern: '^[a-zA-Z0-9]{3,30}$',
          },
        },
      },
      name: {
        type: 'object',
        properties: {
          filename: { type: 'string', minLength: 3, maxLength: 20 },
        },
      },
      status: {
        type: 'object',
        properties: {
          filename: { type: 'string', minLength: 3, maxLength: 20 },
        },
      },
    },
    required: ['email', 'password', 'name', 'status'],
  },
};
