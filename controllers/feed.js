const getPosts = async (request, reply) => {
  return {
    posts: [
      {
        title: 'First post',
        content: 'This is the content of the first post',
      },
    ],
  };
};

const postPost = async (request, reply) => {
  const { title, content } = request.body;

  reply.code(201);
  return {
    message: 'Post created successfully!',
    post: {
      id: new Date().toISOString(),
      title,
      content,
    },
  };
};

const feedController = {
  getPosts,
  postPost,
};

export default feedController;
