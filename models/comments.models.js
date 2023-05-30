const db = require("../db/connection");
const { CheckReviewExist, CheckCommentExist } = require("../db/seeds/utils");

exports.fetchCommentById = (review_id) => {
  return CheckReviewExist(review_id).then(() => {
    return db.query(`
      SELECT *
      FROM comments
      WHERE review_id = $1
      ORDER BY created_at DESC;
      `, [review_id]).then((result) => {
        if (result.rows.length === 0 && review_id) {
          return Promise.reject({status: 200, msg: `There is no comment for review #${review_id}.`});
        } else {
          return result.rows;
        }
      });
  })
}

exports.createComment = (review_id, newComment) => {
  const {username, body} = newComment
  console.log(body)
  return CheckReviewExist(review_id).then(()=>{
  return db.query(`
  INSERT INTO comments(review_id, body, author)
  VALUES ($1, $2, $3)
  RETURNING * ;
  `,[review_id, body, username])}).then((result) => {
    // console.log(result.rows)
    return result.rows[0]
  })
}

exports.removeComment = (comment_id) => {
  return CheckCommentExist(comment_id).then(() => { 
    return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *', [comment_id])
        })
}