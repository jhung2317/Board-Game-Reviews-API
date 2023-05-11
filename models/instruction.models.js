const fs = require('fs/promises');

const fetchInstructions = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, 'utf-8').then((content) =>{
        return JSON.parse(content);
    });
}

module.exports = {fetchInstructions}

