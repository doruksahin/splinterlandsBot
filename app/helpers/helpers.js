const fs = require('fs');


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

module.exports = {
    writeToJson
};