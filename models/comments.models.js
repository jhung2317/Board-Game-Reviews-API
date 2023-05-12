const db = require("../db/connection");
const { CheckReviewExist } = require("../db/seeds/utils");

exports.fetchCommentById = (review_id) => {
  return CheckReviewExist(review_id).then(() => {
    return db.query(`
      SELECT *
      FROM comments
      WHERE review_id = $1
      ORDER BY created_at DESC;
      `, [review_id]).then((result) => {
        if (result.rows.length === 0 && review_id) {
            return Promise.reject({status: 404, msg: 'Comment Not Found.'});
        } else if (result.rows.length === 0 ){
          return Promise.reject({status: 404, msg: 'Review Not Found.'});
        } else {
            return result.rows;
        }
      });
  })
  

}