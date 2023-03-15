"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYesterday = exports.getLastFridayOf = exports.writeJsonFile = exports.readJsonFile = exports.getEstDate = void 0;
const fs_1 = require("fs");
const getEstDate = async () => {
    const date = new Date();
    let offset = -300; // Timezone offset for EST in minutes.
    let estDate = new Date(date.getTime() + offset * 60 * 1000)
        .toISOString()
        .slice(0, 10);
    return estDate;
};
exports.getEstDate = getEstDate;
const readJsonFile = async (path) => {
    try {
        const rawJson = (0, fs_1.readFileSync)(path);
        const parsedJson = JSON.parse(rawJson.toString());
        return parsedJson;
    }
    catch (error) {
        console.log(error);
        return null;
    }
};
exports.readJsonFile = readJsonFile;
const writeJsonFile = async (path, jsonData) => {
    try {
        // Serialize as JSON and write it to the file
        (0, fs_1.writeFileSync)(path, JSON.stringify(jsonData, null, 2)); // formating
    }
    catch (error) {
        console.log(error);
    }
};
exports.writeJsonFile = writeJsonFile;
const getLastFridayOf = async (date) => {
    let d = new Date(date);
    let day = d.getDay();
    let diff = day <= 5 ? 7 - 5 + day : day - 5;
    d.setDate(d.getDate() - diff);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    const lastFriday = new Date(d.getTime()).toISOString().slice(0, 10);
    return lastFriday;
};
exports.getLastFridayOf = getLastFridayOf;
const getYesterday = async (date) => {
    // sets the date-time to date-00:00:00
    const d = new Date(date);
    const yesterday = new Date(d);
    yesterday.setDate(d.getDate() - 1);
    return yesterday.toISOString().slice(0, 10);
};
exports.getYesterday = getYesterday;
