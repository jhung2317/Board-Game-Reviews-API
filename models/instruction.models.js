const fs = require('fs/promises');

exports.fetchInstructions = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, 'utf-8').then((content) =>{
        return JSON.parse(content);
    });
}