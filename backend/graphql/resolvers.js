import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../models/user.js';
import { Post } from '../models/post.js';
import { clearImage } from '../utils/clearImage.js';

const resolvers = {
  Query: {
    login: async (_, args, req) => {
      const { email, password } = args;
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('User does not exist!');
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        throw new Error('Password is incorrect!');
      }

      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id.toString(),
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return {
        token: token,
        userId: user._id,
      };
    },
    getPosts: async (_, args, { reply }) => {
      if (!reply.isAuth) {
        throw new Error('Not authenticated!');
      }
      const { page } = args;
      if (!page) {
        page = 1;
      }
      const perPage = 2;
      const totalPosts = await Post.find().countDocuments();
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .populate('creator');

      return {
        posts: posts.map((post) => {
          return {
            ...post._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
          };
        }),
        totalItems: totalPosts,
      };
    },
    getPost: async (_, args, { reply }) => {
      if (!reply.isAuth) {
        throw new Error('Not authenticated!');
      }
      const { postId } = args;
      const post = await Post.findById(postId).populate('creator');

      if (!post) {
        throw new Error('Post not found!');
      }

      return {
        ...post._doc,
        _id: post._id.toString(),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      };
    },
    getUser: async (_, args, { reply }) => {
      if (!reply.isAuth) {
        throw new Error('Not authenticated!');
      }
      const user = await User.findById(reply.userId);

      if (!user) {
        throw new Error('User not found!');
      }

      return {
        ...user._doc,
        _id: user._id.toString(),
      };
    },
  },
  Mutation: {
    createUser: async (_, args, { reply }) => {
      if (!reply.isAuth) {
        throw new Error('Not authenticated!');
      }
      const errors = [];
      if (!validator.isEmail(args.userInput.email)) {
        errors.push({ message: 'E-Mail is invalid.', status: 422 });
      }
      if (
        validator.isEmpty(args.userInput.password) ||
        !validator.isLength(args.userInput.password, { min: 5 })
      ) {
        errors.push({ message: 'Password too short!', status: 422 });
      }
      if (errors.length > 0) {
        const error = new Error('Invalid input.');
        error.extensions = {
          errors,
        };
        throw error;
      }
      const existingUser = await User.findOne({ email: args.userInput.email });

      if (existingUser) {
        throw new Error('User exists already!');
      }

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        name: args.userInput.name,
        password: hashedPassword,
      });
      const createdUser = await user.save();

      return { ...createdUser._doc, _id: createdUser._id.toString() };
    },
    createPost: async (_, { postInput }, { reply }) => {
      if (!reply.isAuth) {
        throw new Error('Unauthenticated!');
      }
      const errors = [];
      const { title, content, imageUrl } = postInput;
      if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
        errors.push({ message: 'Title is invalid.', status: 422 });
      }
      if (
        validator.isEmpty(content) ||
        !validator.isLength(content, { min: 5 })
      ) {
        errors.push({ message: 'Content is invalid.', status: 422 });
      }
      if (errors.length > 0) {
        const error = new Error('Invalid input.');
        error.extensions = {
          errors: errors.map((err) => ({
            message: err.message,
            status: err.status,
          })),
        };
        throw error;
      }
      const user = await User.findById(reply.userId);
      if (!user) {
        throw new Error('Invalid user.');
      }
      const post = new Post({
        title,
        content,
        imageUrl,
        creator: user,
      });
      await post.save();

      user.posts.push(post);
      await user.save();

      return {
        ...post._doc,
        _id: post._id.toString(),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      };
    },
    updatePost: async (_, { postId, postInput }, { reply }) => {
      if (!reply.isAuth) {
        throw new Error('Unauthenticated!');
      }
      const errors = [];
      const { title, content, imageUrl } = postInput;
      if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
        errors.push({ message: 'Title is invalid.', status: 422 });
      }
      if (
        validator.isEmpty(content) ||
        !validator.isLength(content, { min: 5 })
      ) {
        errors.push({ message: 'Content is invalid.', status: 422 });
      }
      if (errors.length > 0) {
        const error = new Error('Invalid input.');
        error.extensions = {
          errors: errors.map((err) => ({
            message: err.message,
            status: err.status,
          })),
        };
        throw error;
      }
      const post = await Post.findById(postId).populate('creator');
      if (!post) {
        throw new Error('No post found!');
      }
      if (post.creator._id.toString() !== reply.userId.toString()) {
        throw new Error('Not authorized!');
      }
      post.title = title;
      post.content = content;
      if (imageUrl !== 'undefined') {
        post.imageUrl = imageUrl;
      }
      const updatedPost = await post.save();

      return {
        ...updatedPost._doc,
        _id: updatedPost._id.toString(),
        createdAt: updatedPost.createdAt.toISOString(),
        updatedAt: updatedPost.updatedAt.toISOString(),
      };
    },
    deletePost: async (_, { postId }, { reply }) => {
      if (!reply.isAuth) {
        throw new Error('Unauthenticated!');
      }

      const post = await Post.findById(postId);
      if (!post) {
        throw new Error('No post found!');
      }
      if (post.creator.toString() !== reply.userId.toString()) {
        throw new Error('Not authorized!');
      }
      await Post.findByIdAndRemove(postId);
      const user = await User.findById(reply.userId);
      user.posts.pull(postId);
      await user.save();

      clearImage(post.imageUrl);

      return true;
    },
    updateStatus: async (_, { status }, { reply }) => {
      if (!reply.isAuth) {
        throw new Error('Unauthenticated!');
      }

      const user = await User.findById(reply.userId);
      if (!user) {
        throw new Error('Invalid user.');
      }
      user.status = status;
      await user.save();

      return {
        ...user._doc,
        _id: user._id.toString(),
      };
    },
  },
};

export default resolvers;
