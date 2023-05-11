const db = require("../db/connection");

exports.selectReviewById = (id) => {
    return db.query(`
        SELECT *
        FROM reviews
        WHERE review_id = $1;
        `,[id] ).then((result) => {
        if (result.rows.length === 0) {
            console.log(result.rows)
            return Promise.reject({status: 404, msg: 'Review Not Found.'});
        } else {
            return result.rows;
        }
    });

}