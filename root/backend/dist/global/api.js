"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchContent = exports.getData = exports.getStock = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const memory_cache_1 = __importDefault(require("memory-cache"));
const util_1 = require("./util");
/**
 * Retrieves the stock information for the given date;
 * If date2 is included, that will be the start date for the retrieval
 *
 */
const getStock = async (date, symbol, date2 = undefined) => {
    const API_KEY = process.env.API_KEY;
    try {
        const res = await axios_1.default.get(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/2/minute/${date2 ? date2 : date}/${date}?adjusted=true&sort=desc&limit=120&apiKey=${API_KEY}`);
        const { ticker, resultsCount, results } = res.data;
        return { ticker, resultsCount, results };
    }
    catch (error) {
        throw Error(error);
    }
};
exports.getStock = getStock;
const getData = async (date1, symbols, date2 = undefined) => {
    let data = [];
    for (let i = 0; i < symbols.length; i++) {
        try {
            const res = await (0, exports.getStock)(date1, symbols[i], date2);
            data.push(res);
        }
        catch (error) {
            throw Error(error);
        }
    }
    return data;
};
exports.getData = getData;
const fetchContent = async (io) => {
    const date = await (0, util_1.getEstDate)();
    const day = new Date(date).getDay();
    const lastFriday = await (0, util_1.getLastFridayOf)(date);
    const yesterday = await (0, util_1.getYesterday)(date);
    if ((0, fs_1.existsSync)('./data/symbols.json')) {
        try {
            const rawJson = (0, fs_1.readFileSync)('./data/symbols.json');
            const parsedJson = JSON.parse(rawJson.toString());
            const { symbols } = parsedJson;
            let data = [];
            switch (day) {
                case 0:
                case 6: {
                    data = await (0, exports.getData)(lastFriday, symbols);
                    break;
                }
                case 1: {
                    data = await (0, exports.getData)(date, symbols, lastFriday);
                    break;
                }
                default: {
                    data = await (0, exports.getData)(date, symbols, yesterday);
                    break;
                }
            }
            if (data.length > 0) {
                // Emit the data to users already connected
                io.emit('update-content', { data });
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
};
exports.fetchContent = fetchContent;
