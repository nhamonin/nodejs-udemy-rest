import fs from 'node:fs';
import path from 'node:path';

import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { User } from '../models/user.js';
import { Post } from '../models/post.js';
import {
  getPosts,
  postPost,
  getPost,
  putPost,
  deletePost,
} from '../controllers/feed.js';

describe('Feed Controller', () => {
  const userId = '5c0f66b979af55031b34728a';

  before(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);

    const user = new User({
      email: 'test12345@gmail.com',
      password: 'test12345',
      name: 'Testqq',
      posts: [],
      _id: userId,
    });

    await user.save();
  });

  after(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  it('should add a created post to the posts of the creator', async () => {
    const req = {
      body: {
        title: {
          value: 'A Test Post',
        },
        content: {
          value: 'A Test Post',
        },
        image: {
          path: 'test.png',
          filename: 'test.png',
          toBuffer: function () {
            return fs.readFileSync(
              path.join(process.cwd(), 'images', 'test.png')
            );
          },
        },
      },
      userId: userId,
      file: {
        path: path.resolve(process.cwd(), '..', 'images', 'test.png'),
        filename: 'test.png',
        toBuffer: function () {
          return fs.promises.readFile(this.path);
        },
      },
    };
    console.log(path.resolve(process.cwd(), '..', 'images', 'test.png'));
    const reply = {
      statusCode: 500,
      response: null,
      code: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (response) {
        this.response = response;
        return this.response;
      },
      log: {
        info: function (message) {
          console.log(message);
        },
        error: function (message) {
          console.log(message);
        },
      },
    };

    await postPost(req, reply);
    const user = await User.findById(userId);
    expect(user).to.have.property('posts');
    expect(user.posts).to.have.length(1);
  });
});
