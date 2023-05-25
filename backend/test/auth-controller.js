import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { User } from '../models/user.js';
import { login, getStatus } from '../controllers/auth.js';

describe('Auth Controller - Login', () => {
  const userId = '5c0f66b979af55031b34728a';
  before(async () => {
    const user = new User({
      email: 'test12345@gmail.com',
      password: 'test12345',
      name: 'Testqq',
      posts: [],
      _id: userId,
    });

    await mongoose.connect(process.env.MONGODB_URI_TEST);
    await user.save();
  });

  after(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  it('should throw an error with error 500 if accessing the database fails', async () => {
    sinon.stub(User, 'findOne');
    User.findOne.throws();

    const req = {
      body: {
        email: 'test@mail.com',
        password: 'test',
      },
    };
    const reply = {
      code: function (code) {
        this.statusCode = code;
      },
    };

    try {
      await login(req, reply);
      throw new Error('Expected login to throw, but it did not.');
    } catch (err) {
      expect(reply.statusCode).to.equal(500);
      expect(err.message).to.equal('Internal Server Error');
    }
    sinon.restore();
  });

  it('should send a response with a valid user status for an existing user', async () => {
    const req = {
      userId,
      statusCode: 500,
    };
    const reply = {
      code: function (code) {
        this.statusCode = code;
        return this;
      },
    };
    const res = await getStatus(req, reply);
    expect(reply.statusCode).to.equal(200);
    expect(res.status).to.equal('I am new!');
  });
});
