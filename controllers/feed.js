const getPosts = async (request, reply) => {
  reply.type('text/html');
  return '<h1>Hello World</h1>';
};

const feedController = {
  getPosts,
};

export default feedController;
