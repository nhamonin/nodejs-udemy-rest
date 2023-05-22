export const feedSchema = {
  body: {
    type: 'object',
    properties: {
      title: {
        type: 'object',
        properties: {
          value: { type: 'string' },
        },
      },
      content: {
        type: 'object',
        properties: {
          value: { type: 'string' },
        },
      },
      image: {
        type: 'object',
        properties: {
          filename: { type: 'string' },
        },
      },
    },
    required: ['title', 'content', 'image'],
  },
};
