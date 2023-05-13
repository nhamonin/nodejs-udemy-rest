const getPosts = async (request, reply) => {
  return {
    posts: [
      {
        _id: '1',
        title: 'First post',
        content: 'This is the content of the first post',
        imageUrl: 'images/cat.jpg',
        creator: {
          name: 'Nazarii',
        },
        createdAt: new Date(),
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
      _id: new Date().toISOString(),
      title,
      content,
      creator: {
        name: 'Nazarii',
      },
      createdAt: new Date(),
    },
  };
};

const feedController = {
  getPosts,
  postPost,
};

export default feedController;
