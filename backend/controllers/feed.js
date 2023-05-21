import fs from 'node:fs';
import path from 'node:path';

import { Post } from '../models/post.js';

const uploadDir = path.resolve('backend', 'images');

const getPosts = async (request, reply) => {
  const posts = await Post.find();

  return {
    message: 'Fetched posts successfully!',
    posts,
  };
};

const postPost = async (request, reply) => {
  try {
    const { title, content, image } = request.body;
    const [name, ext] = image.filename.split('.');
    const newName = `${name}-${Date.now()}.${ext}`;
    const uploadPath = path.join(uploadDir, newName);
    const fileStream = fs.createWriteStream(uploadPath);
    const file = await image.toBuffer();

    fileStream.write(file);

    const post = new Post({
      title: title.value,
      content: content.value,
      imageUrl: `backend/images/${newName}`,
      creator: {
        name: 'Nazarii',
      },
    });

    await post.save();

    reply.code(201);
    reply.log.info('Post created successfully!');
    return {
      message: 'Post created successfully!',
      post,
    };
  } catch (error) {
    reply.log.error(error);
    reply.code(500);
    return {
      error: 'Internal Server Error',
      message: 'An error occurred while creating the post.',
    };
  }
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

export { getPosts, postPost, getPost };
