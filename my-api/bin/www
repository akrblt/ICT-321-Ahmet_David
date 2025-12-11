import app from '../app.js';
import http from 'http';

// Normalize a port into a number, string, or false.
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
}

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('listening', () => {
    console.log(`Server running on port ${port}`);
});
