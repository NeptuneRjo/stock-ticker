"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const scraper_1 = require("./global/scraper");
const api_1 = require("./global/api");
const node_cron_1 = __importDefault(require("node-cron"));
const memory_cache_1 = __importDefault(require("memory-cache"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const content = memory_cache_1.default.get('content');
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'https://stock-ticker.onrender.com/'],
        credentials: true,
    },
});
exports.io = io;
/* <-- MIDDLEWARE --> */
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'https://stock-ticker.onrender.com/'],
    credentials: true,
}));
// Run job at 12:00 at EST time
const scheduledScrape = node_cron_1.default.schedule('0 12 * * *', () => {
    (0, scraper_1.scrapeAndUpdate)();
}, {
    timezone: 'US/Eastern',
});
// Initialize the data on server startup
if (content === null) {
    (0, api_1.fetchContent)(io);
}
// Fetch the content every 2 minutes
const scheduledFetch = node_cron_1.default.schedule('*/2 * * * *', () => {
    (0, api_1.fetchContent)(io);
});
// Start the 2 minute schedule
scheduledFetch.start();
scheduledScrape.start();
/* <-- ROUTES --> */
const port = 8000 || process.env.PORT;
io.on('connection', (socket) => {
    socket.on('initialize', () => {
        const content = memory_cache_1.default.get('content');
        if (content !== null) {
            socket.volatile.emit('content', { data: content });
        }
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
server.listen(port, () => {
    console.log(`Server sucessfully started and listening on port ${port}`);
});
