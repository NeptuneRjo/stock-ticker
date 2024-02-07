"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchContent = exports.getData = exports.getStock = void 0;
const memory_cache_1 = __importDefault(require("memory-cache"));
const util_1 = require("./util");
/**
 * Retrieves the stock information for the given date;
 * If date2 is included, that will be the start date for the retrieval
 *
 */
const getStock = (date, symbol, date2 = undefined) => __awaiter(void 0, void 0, void 0, function* () {
    const API_KEY = process.env.API_KEY;
    try {
        // const res = await axios.get(
        // 	`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/2/minute/${
        // 		date2 ? date2 : date
        // 	}/${date}?adjusted=true&sort=desc&limit=120&apiKey=${API_KEY}`
        // )
        // const { ticker, resultsCount, results } = res.data
        // return { ticker, resultsCount, results }
        return { ticker: "", resultsCount: 0, results: [] };
    }
    catch (error) {
        throw Error(error);
    }
});
exports.getStock = getStock;
const getData = (date1, symbols, date2 = undefined) => __awaiter(void 0, void 0, void 0, function* () {
    let data = [];
    for (let i = 0; i < symbols.length; i++) {
        try {
            const res = yield (0, exports.getStock)(date1, symbols[i], date2);
            data.push(res);
        }
        catch (error) {
            throw Error(error);
        }
    }
    return data;
});
exports.getData = getData;
const fetchContent = (io) => __awaiter(void 0, void 0, void 0, function* () {
    const date = yield (0, util_1.getEstDate)();
    const day = new Date(date).getDay();
    const lastFriday = yield (0, util_1.getLastFridayOf)(date);
    const yesterday = yield (0, util_1.getYesterday)(date);
    try {
        const symbols = ['TSLA', 'BAC', 'AMD', 'F', 'SWN'];
        let data = [];
        switch (day) {
            case 0:
            case 6: {
                data = yield (0, exports.getData)(lastFriday, symbols);
                break;
            }
            case 1: {
                data = yield (0, exports.getData)(date, symbols, lastFriday);
                break;
            }
            default: {
                data = yield (0, exports.getData)(date, symbols, yesterday);
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
});
exports.fetchContent = fetchContent;
