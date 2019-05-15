// Include it and extract some methods for convenience
const server = require('server');
const port = 3000;
const { get, post } = server.router;


console.log(`Server is listening on ${port}`);
console.log(`Visit http://localhost:${port}`);

// Launch server with options and a couple of routes
server({ port: port }, [
  get('/', ctx => 'Hello world'),
]);