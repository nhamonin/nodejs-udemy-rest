import jwt from 'jsonwebtoken';

function isAuthenticated(request, reply, done) {
  const { authorization } = request?.headers;

  if (!authorization) {
    reply.isAuth = false;
    return done();
  }

  const [bearer, authHeader] = request?.headers['authorization']?.split(' ');
  let decodedToken;

  if (!authHeader) {
    reply.isAuth = false;
    return done();
  }

  try {
    decodedToken = jwt.verify(authHeader, process.env.JWT_SECRET);
  } catch (err) {
    reply.isAuth = false;
    return done();
  }

  if (!decodedToken) {
    reply.isAuth = false;
    return done();
  }

  reply.userId = decodedToken.userId;
  reply.isAuth = true;

  return done();
}

export default isAuthenticated;
