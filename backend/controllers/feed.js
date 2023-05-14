import { Post } from '../models/post.js';

const getPosts = async (request, reply) => {
  const posts = await Post.find();

  return {
    message: 'Fetched posts successfully!',
    posts,
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

const getPost = async (request, reply) => {
  const { postId } = request.params;
  const post = await Post.findById(postId);

  if (!post) {
    reply.code(404);
    return {
      message: 'Post not found!',
    };
  }

  return {
    message: 'Post fetched successfully!',
    post,
  };
};

const feedController = {
  getPosts,
  postPost,
  getPost,
};

export default feedController;
