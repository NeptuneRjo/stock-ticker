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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYesterday = exports.getLastFridayOf = exports.writeJsonFile = exports.readJsonFile = exports.getEstDate = void 0;
const fs_1 = require("fs");
/** Returns the current date in Eastern-Standard-Time */
const getEstDate = () => __awaiter(void 0, void 0, void 0, function* () {
    const date = new Date();
    let offset = -300; // Timezone offset for EST in minutes.
    let estDate = new Date(date.getTime() + offset * 60 * 1000)
        .toISOString()
        .slice(0, 10);
    return estDate;
});
exports.getEstDate = getEstDate;
/** Returns the parsed json of the given JSON file; returns null if there is an error */
const readJsonFile = (path) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawJson = (0, fs_1.readFileSync)(path);
        const parsedJson = JSON.parse(rawJson.toString());
        return parsedJson;
    }
    catch (error) {
        console.log(error);
        return null;
    }
});
exports.readJsonFile = readJsonFile;
/** Writes to the given JSON file */
const writeJsonFile = (path, jsonData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Serialize as JSON and write it to the file
        (0, fs_1.writeFileSync)(path, JSON.stringify(jsonData, null, 2)); // formating
    }
    catch (error) {
        console.log(error);
    }
});
exports.writeJsonFile = writeJsonFile;
/** Returns the date string of the last friday of the given date string; YYYY-MM-DD */
const getLastFridayOf = (date) => __awaiter(void 0, void 0, void 0, function* () {
    let d = new Date(date);
    let day = d.getDay();
    let diff = day <= 5 ? 7 - 5 + day : day - 5;
    d.setDate(d.getDate() - diff);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    const lastFriday = new Date(d.getTime()).toISOString().slice(0, 10);
    return lastFriday;
});
exports.getLastFridayOf = getLastFridayOf;
/** Returns the date string of yesterday; YYYY-MM-DD  */
const getYesterday = (date) => __awaiter(void 0, void 0, void 0, function* () {
    // sets the date-time to date-00:00:00
    const d = new Date(date);
    const yesterday = new Date(d);
    yesterday.setDate(d.getDate() - 1);
    return yesterday.toISOString().slice(0, 10);
});
exports.getYesterday = getYesterday;
