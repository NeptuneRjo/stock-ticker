"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStock = exports.getLastFridayOf = void 0;
const axios_1 = __importDefault(require("axios"));
const server_1 = require("../server");
const fs_1 = require("fs");
const memory_cache_1 = __importDefault(require("memory-cache"));
function getLastFridayOf(date) {
    let d = new Date(date);
    let day = d.getDay();
    let diff = day <= 5 ? 7 - 5 + day : day - 5;
    d.setDate(d.getDate() - diff);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    return d.getTime();
}
exports.getLastFridayOf = getLastFridayOf;
async function getStock(date, symbol) {
    const API_KEY = process.env.API_KEY;
    try {
        const res = await axios_1.default.get(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/5/minute/${date}/${date}?adjusted=true&sort=desc&limit=120&apiKey=${API_KEY}`);
        const { ticker, resultsCount, results } = res.data;
        return { ticker, resultsCount, results };
    }
    catch (error) {
        throw Error(error);
    }
}
exports.getStock = getStock;
async function fetchContent() {
    const currentDate = new Date().toISOString().slice(0, 10);
    const lastFriday = new Date(getLastFridayOf(currentDate))
        .toISOString()
        .slice(0, 10);
    const currentDayNumber = new Date().getDate();
    if ((0, fs_1.existsSync)('symbols.json')) {
        try {
            const rawJson = (0, fs_1.readFileSync)('symbols.json');
            const parsedJson = JSON.parse(rawJson.toString());
            const { symbols } = parsedJson;
            let data = [];
            if (currentDayNumber === (6 || 7)) {
                for (let i = 0; i < symbols.length; i++) {
                    try {
                        const res = await getStock(lastFriday, symbols[i]);
                        data.push(res);
                    }
                    catch (error) {
                        throw Error(error);
                    }
                }
            }
            else {
                for (let i = 0; i < symbols.length; i++) {
                    try {
                        const res = await getStock(currentDate, symbols[i]);
                        data.push(res);
                    }
                    catch (error) {
                        throw Error(error);
                    }
                }
            }
            if (data.length > 0) {
                // Emit the data to users already connected
                server_1.io.emit('update-content', { data });
                // Cache the data for users that connect in between fetch
                // periods
                memory_cache_1.default.put('content', { data });
            }
        }
        catch (error) {
            console.log('fetch content error', error);
        }
    }
    else {
        console.log('does not exist');
    }
}
exports.default = fetchContent;
