import jwt from 'jsonwebtoken';

async function isAuthenticated(request, reply) {
  const { authorization } = request.headers;

  if (!authorization) {
    reply.code(401);
    throw new Error('Not authenticated.');
  }

  const [bearer, authHeader] = authorization?.split(' ');

  if (!bearer || !authHeader) {
    reply.code(401);
    throw new Error('Not authenticated.');
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(authHeader, process.env.JWT_SECRET);
  } catch (err) {
    reply.code(401);
    throw new Error('Not authenticated.');
  }

  if (!decodedToken) {
    reply.code(401);
    throw new Error('Not authenticated.');
  }

  request.userId = decodedToken.userId;

  return decodedToken;
}

export default isAuthenticated;
