import { expect } from 'chai';
import sinon from 'sinon';

import { User } from '../models/user.js';
import { login } from '../controllers/auth.js';

describe('Auth Controller - Login', () => {
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
  });
});
