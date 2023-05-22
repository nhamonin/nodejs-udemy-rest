import path from 'node:path';
import fs from 'node:fs';

import { Post } from '../models/post.js';
import { User } from '../models/user.js';
import { saveImage } from '../utils/saveImage.js';

const getPosts = async (request, reply) => {
  const page = request.query.page || 1;
  const perPage = 2;
  const totalItems = await Post.find().countDocuments();
  const posts = await Post.find()
    .populate('creator')
    .skip((page - 1) * perPage)
    .limit(perPage);

  return {
    message: 'Fetched posts successfully!',
    posts,
    totalItems,
  };
};

const postPost = async (request, reply) => {
  try {
    const { title, content, image } = request.body;
    const newName = await saveImage(image);
    const post = new Post({
      title: title.value,
      content: content.value,
      imageUrl: `backend/images/${newName}`,
      creator: request.userId,
    });
    await post.save();

    const user = await User.findById(request.userId);
    user.posts.push(post);
    await user.save();

    reply.code(201);
    reply.log.info('Post created successfully!');
    return {
      message: 'Post created successfully!',
      post,
      creator: {
        _id: user._id,
        name: user.name,
      },
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

const putPost = async (request, reply) => {
  const { postId } = request.params;
  const { title, content, image } = request.body;
  let imageUrl = image.value;

  if (image.mimetype.includes('image')) {
    let newName = await saveImage(image);
    imageUrl = `backend/images/${newName}`;
  }

  if (!imageUrl) {
    reply.code(422);
    return {
      message: 'No file picked.',
    };
  }

  const post = await Post.findById(postId);

  if (!post) {
    reply.code(404);
    return {
      message: 'Post not found!',
    };
  }

  if (post.creator.toString() !== request.userId) {
    reply.code(403);
    return {
      message: 'Not authorized!',
    };
  }

  imageUrl !== post.imageUrl && clearImage(post.imageUrl);
  post.title = title.value;
  post.content = content.value;
  post.imageUrl = imageUrl;

  await post.save();

  reply.code(200);
  return {
    message: 'Post updated successfully!',
    post,
  };
};

const deletePost = async (request, reply) => {
  const { postId } = request.params;

  const post = await Post.findById(postId);

  if (!post) {
    reply.code(404);
    return {
      message: 'Post not found!',
    };
  }

  if (post.creator.toString() !== request.userId) {
    reply.code(403);
    return {
      message: 'Not authorized!',
    };
  }

  clearImage(post.imageUrl);
  await Post.findByIdAndRemove(postId);

  const user = await User.findById(request.userId);

  user.posts.pull(postId);
  await user.save();

  reply.code(200);
  return {
    message: 'Post deleted successfully!',
  };
};

const clearImage = (filePath) => {
  filePath = path.join(process.cwd(), filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

export { getPosts, postPost, getPost, putPost, deletePost };
