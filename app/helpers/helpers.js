const fs = require('fs');
const { postgresErrorHandler } = require('./handleErrors')

function writeToJson(data, fname) {
    const stringData = JSON.stringify(data, null, 4);

    // write JSON string to a file
    fs.writeFile(fname, stringData, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
}

async function clientQuery(scriptName, params) {
    return await client.query(scriptName, params)
        .catch(e => {
            postgresErrorHandler(e);
        })
}

module.exports = {
    writeToJson,
    clientQuery
};