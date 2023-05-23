export const connections = new Set();

export default function (fastify, options, done) {
  fastify.get('/', { websocket: true }, (connection, req) => {
    console.log('Client connected');
    connections.add(connection);
    connection.socket.on('message', (message) => {
      console.log('Received message from client:', message.toString());
    });
  });

  done();
}
