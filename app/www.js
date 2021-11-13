const express = require('express');
const router = require("./route");

const server = express();
server.use("/analyse", router);

server.listen(5000, () => {
    console.log("https://localhost:5000 is listening.")
})
