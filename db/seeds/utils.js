const db = require("../connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
	if (!created_at) return { ...otherProperties };
	return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
	return arr.reduce((ref, element) => {
		ref[element[key]] = element[value];
		return ref;
	}, {});
};

exports.formatComments = (comments, idLookup) => {
	return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
		const article_id = idLookup[belongs_to];
		return {
			article_id,
			author: created_by,
			...this.convertTimestampToDate(restOfComment),
		};
	});
};

exports.CheckReviewExist = (review_id) => {
  if (isNaN(review_id)) {
      return Promise.reject({status: 400, msg: 'Bad Request.'});
    } 
  return db.query(`
  SELECT *
  FROM reviews
  WHERE review_id = $1;
  `,[review_id] ).then((result) => {
    if (result.rows.length === 0 && review_id) {
      return Promise.reject({status: 404, msg: 'Review Not Found.'});
    } 
        //else do nothing
    });
}

exports.CheckCommentExist = (comment_id) => {
  if (isNaN(comment_id)) {
      return Promise.reject({status: 400, msg: 'Bad Request.'});
    } 
  return db.query(`
  SELECT *
  FROM comments
  WHERE comment_id = $1;
  `,[comment_id] ).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({status: 404, msg: `No comment found with id: ${comment_id}`});
    } 
        //else do nothing
    });
}