"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeAndUpdate = exports.scrape = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const server_1 = require("../server");
const util_1 = require("./util");
const scrape = async () => {
    try {
        const browser = await puppeteer_1.default.launch();
        const page = await browser.newPage();
        await page.goto('https://finance.yahoo.com/most-active/?offset=0&count=50');
        // Set screen size
        await page.setViewport({ width: 1920, height: 1080 });
        // Gets the 50 symbols and stores them as an array
        const symbolsArray = await page.evaluate(() => Array.from(document.querySelectorAll('div#scr-res-table div table tbody tr td a'), (element) => element.textContent));
        if (symbolsArray.length < 5) {
            throw Error('The returned length of the symbols is less than 5, skipping JSON overwrite');
        }
        return symbolsArray.slice(0, 5);
    }
    catch (error) {
        console.log('Scrape Error: ', error);
        return undefined;
    }
};
exports.scrape = scrape;
const scrapeAndUpdate = async () => {
    try {
        const filePath = './data/symbols.json';
        const estDate = await (0, util_1.getEstDate)();
        const symbolsArray = await (0, exports.scrape)();
        const jsonData = await (0, util_1.readJsonFile)(filePath);
        jsonData.date = estDate;
        // Keep the symbols the same if none are returned from the scrape
        jsonData.symbols =
            symbolsArray === undefined ? jsonData.symbols : symbolsArray;
        await (0, util_1.writeJsonFile)(filePath, jsonData);
        const updatedJson = await (0, util_1.readJsonFile)(filePath);
        server_1.io.emit('update-symbols', updatedJson);
    }
    catch (error) {
        console.log(error);
    }
};
exports.scrapeAndUpdate = scrapeAndUpdate;
