const express = require('express');
const router = require("./route");
const schedule = require('node-schedule');


const { Client } = require('pg');
global.client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'splinterlands',
    password: 'dodo1234',
    port: 5432,
});

async function startServer() {
    await client.connect();
    const server = express();
    server.use("/analyse", router);
    server.listen(5000, () => {
        console.log("https://localhost:5000 is listening.")
    });

};

async function startCrawlDataScheduler() {
    schedule.scheduleJob('fetch data', '*/10 * * * *', async () => {
        require('./worker.js');
    });
}



startServer();
startCrawlDataScheduler();
