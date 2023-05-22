import jwt from 'jsonwebtoken';

async function isAuthenticated(request, reply) {
  const [bearer, authHeader] = request.headers['authorization'].split(' ');
  let decodedToken;

  try {
    decodedToken = jwt.verify(authHeader, process.env.JWT_SECRET);
  } catch (err) {
    reply.code(500);
    throw new Error('Something went wrong.');
  }

  if (!decodedToken) {
    reply.code(401);
    throw new Error('Not authenticated.');
  }

  request.userId = decodedToken.userId;

  return decodedToken;
}

export default isAuthenticated;