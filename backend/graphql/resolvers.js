const resolvers = {
  Query: {
    hello: () => {
      return {
        text: 'Hello World!',
        views: 123,
      };
    },
  },
};

export default resolvers;
