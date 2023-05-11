const db = require("../db/connection");

exports.selectReviewById = (id) => {
    return db.query(`
        SELECT *
        FROM reviews
        WHERE review_id = $1;
        `,[id] ).then((result) => {
        if (result.rows.length === 0) {

            return Promise.reject({status: 404, msg: 'Review Not Found.'});
        } else {
            return result.rows;
        }
    });

}

exports.fetchAllReviews= () => {
  return db.query(`
    SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT (comments.comment_id) AS comment_count
    FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;
  `)
  .then((result) => {
    result.rows.forEach((item) => {
      item.comment_count = parseInt(item.comment_count);
    })
    return result.rows;
  })

}