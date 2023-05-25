import { expect } from 'chai';
import isAuthenticated from '../hooks/is-auth.js';

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
