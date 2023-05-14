import { Post } from '../models/post.js';

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
  const post = new Post({
    title,
    content,
    imageUrl: 'images/cat.jpg',
    creator: {
      name: 'Nazarii',
    },
  });

  await post.save();
  reply.code(201);
  return {
    message: 'Post created successfully!',
    post,
  };
};

const feedController = {
  getPosts,
  postPost,
};

export default feedController;
