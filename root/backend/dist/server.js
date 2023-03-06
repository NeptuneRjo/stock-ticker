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
require("dotenv/config");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
exports.io = io;
/* <-- MIDDLEWARE --> */
(0, scraper_1.default)();
/* <-- ROUTES --> */
const port = 8000 || process.env.PORT;
io.on('connection', (socket) => {
    console.log('A user has connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
server.listen(port, () => {
    console.log(`Server sucessfully started and listening on port ${port}`);
});
