import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';

import isAuthenticated from '../hooks/is-auth.js';

describe('isAuthenticated Hook', () => {
  it('should throw an error if no authorization header is present', async () => {
    const req = {
      headers: {
        authorization: null,
      },
    };
    const reply = {
      code: () => {},
    };

    try {
      await isAuthenticated(req, reply);
      throw new Error('Expected isAuthenticated to throw, but it did not.');
    } catch (err) {
      expect(err.message).to.equal('Not authenticated.');
    }
  });

  it('should throw an error if the authorization header is only one string', async () => {
    const req = {
      headers: {
        authorization: 'only-one-string',
      },
    };
    const reply = {
      code: () => {},
    };

    try {
      await isAuthenticated(req, reply);
      throw new Error('Expected isAuthenticated to throw, but it did not.');
    } catch (err) {
      expect(err.message).to.equal('Not authenticated.');
    }
  });

  it('should throw an error if the authorization header is not a bearer token', async () => {
    const req = {
      headers: {
        authorization: 'Bearer not-a-bearer-token',
      },
    };

    const reply = {
      code: () => {},
    };

    try {
      await isAuthenticated(req, reply);
      throw new Error('Expected isAuthenticated to throw, but it did not.');
    } catch (err) {
      expect(err.message).to.equal('Not authenticated.');
    }
  });

  it('should yield a userId if the authorization header is a valid bearer token', async () => {
    const req = {
      headers: {
        authorization: 'Bearer valid-bearer-token',
      },
    };
    const reply = {
      code: () => {},
    };

    sinon.stub(jwt, 'verify');
    jwt.verify.returns({
      userId: 'valid-user-id',
    });

    try {
      await isAuthenticated(req, reply);
      expect(req.userId).to.equal('valid-user-id');
    } catch (err) {
      throw new Error('Expected isAuthenticated to not throw, but it did.');
    }

    jwt.verify.restore();
  });
});
