const db = require("../db/connection");

exports.selectCategories = () => {
    return db.query(`
        SELECT *
        FROM categories;
        `).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Not Found.'});
        } else {
            return result.rows;
        }
    });

}