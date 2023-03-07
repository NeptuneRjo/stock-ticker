"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const scraper_1 = __importDefault(require("./global/scraper"));
const fetchContent_1 = __importDefault(require("./global/fetchContent"));
const node_cron_1 = __importDefault(require("node-cron"));
const memory_cache_1 = __importDefault(require("memory-cache"));
require("dotenv/config");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
exports.io = io;
/* <-- MIDDLEWARE --> */
(0, scraper_1.default)();
// Fetch the content every 2 minutes
node_cron_1.default.schedule('*/2 * * * *', () => {
    (0, fetchContent_1.default)();
});
/* <-- ROUTES --> */
const port = 8000 || process.env.PORT;
io.on('connection', (socket) => {
    console.log('A user has connected');
    const content = memory_cache_1.default.get('content');
    if (content !== null) {
        socket.emit('content', content);
    }
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
server.listen(port, () => {
    console.log(`Server sucessfully started and listening on port ${port}`);
});
