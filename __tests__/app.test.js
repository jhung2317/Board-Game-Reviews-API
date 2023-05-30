const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection')
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');

beforeEach(() => seed(testData));
afterAll(() => db.end());

//test is amended for ticket 3.5
describe('api test suite', () => {
    test('GET - /api returns 200 with an JSON Object of all endpoints information', () => {
        return request(app).get('/api').expect(200).then((response) => {
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.Instruction.hasOwnProperty("GET /api")).toBe(true)
            expect(Object.entries(response.body.Instruction).length).toBe(3)
        })
    })
    test('GET - /api/categories returns 200', () => {
        return request(app).get('/api/categories').expect(200).then(({body}) => {
            expect(body.category.length).toBe(4)

            expect(body.category).toBeInstanceOf(Array);
            body.category.forEach(category => {
                expect(typeof category.slug).toBe('string')
                expect(typeof category.description).toBe('string')

            })
        })
    })
})

describe('404 error test', () => {

  test('GET - /api/nonsense returns 400 error msg ', () => {
      return request(app).get('/api/huhgfeame').expect(400).then((res) => {
          expect(res.body.msg).toBe('Bad Request.')
      })
  })
})
//test is amended for ticket 4
describe('GET /api/reviews/:review_id test suite', () => {
  test('GET - status 200 returns a correct review object with 9 properties', () => {
      return request(app).get('/api/reviews/2').expect(200).then(({body}) => {
          body.review.forEach(item => {
              expect( item.review_id ).toBe(2)
              expect(typeof item.title).toBe('string')
              expect(typeof item.review_body).toBe('string')
              expect(typeof item.review_img_url).toBe('string')
              expect(typeof item.votes).toBe('number')
              expect(typeof item.category).toBe('string')
              expect(typeof item.owner).toBe('string')
              expect(typeof item.created_at).toBe('string')
              expect(typeof item.designer).toBe('string')
          })
      })
  })
  test('GET - status 404 - invalid review id will respond with not found.', () => {
    return request(app).get('/api/reviews/9999').expect(404).then(({body}) => {
            expect(body.msg).toBe('Review Not Found.')
        })
  })
})

//test is amended for ticket 5

describe('GET /api/reviews test suite', () => {
  test('GET - status 200 returns a correct review object with 9 properties', () => {
      return request(app).get('/api/reviews').expect(200).then(({body}) => {
        const {reviewData} = testData;
        
        expect(body.Review.length).toBe(reviewData.length);
          body.Review.forEach(item => {
            expect(typeof item.review_id).toBe('number')
            expect(typeof item.title).toBe('string')
            expect(typeof item.review_img_url).toBe('string')
            expect(typeof item.votes).toBe('number')
            expect(typeof item.category).toBe('string')
            expect(typeof item.owner).toBe('string')
            expect(typeof item.created_at).toBe('string')
            expect(typeof item.designer).toBe('string')
            expect(item.hasOwnProperty('review_body')).toBe(false)
            expect(typeof item.comment_count).toBe('number')
          })
      })
  })

  test('GET - status 200 returned array should be sorted by date in descending order.', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({body}) => {
        const {reviews} = body;
          expect( body.Review ).toBeSortedBy('created_at', { descending: true })
      })
  })
})
//test is amended for ticket 6
describe('GET /api/reviews/:review_id/comments test suite', () => {
  test('GET - status 200 returns a correct comment object with 6 properties', () => {
      return request(app).get('/api/reviews/2/comments').expect(200).then(({body}) => {
        body.comments.forEach(item => {
          expect(typeof item.comment_id).toBe('number')
          expect(typeof item.review_id).toBe('number')
          expect(typeof item.votes).toBe('number')
          expect(typeof item.created_at).toBe('string')
          expect(typeof item.author).toBe('string')
          expect(typeof item.body).toBe('string')
        })
      })
  })
  test('GET - status 200 - there is no comment for valid review_id.', () => {
    return request(app).get('/api/reviews/1/comments').expect(200).then(({body}) => {
      expect(body.msg).toBe('There is no comment for review #1.')
    })
  })
  test('GET - status 404 - invalid review id will respond with not found.', () => {
    return request(app).get('/api/reviews/9999/comments').expect(404).then(({body}) => {
      expect(body.msg).toBe('Review Not Found.')
    })
  })
  test('GET - status 400 - invalid input will respond with Bad Request', () => {
    return request(app).get('/api/reviews/nonsense/comments').expect(400).then(({body}) => {
      expect(body.msg).toBe('Bad Request.')
    })
  })
})

//test is amended for ticket 7

describe('Post /api/reviews/:review_id/comments test suite', () => {
  test('Post status 201 returns a posted comment object', () => {
    return request(app)
      .post('/api/reviews/2/comments')
      .send({ username: "mallionaire", body: "Good, very good!" })
      .expect(201)
      .then(({body}) => {
        console.log(body.postedComments)
        const {postedComments} = body;
        expect(postedComments.author).toBe('mallionaire');
        expect(postedComments.body).toBe("Good, very good!")
    })
  })
  test('POST - status 404 - the review_id is not existing.', () => {
    return request(app)
        .post('/api/reviews/99999/comments')
        .send({ username: "mallionaire", body: "Good, very good!" })
        .expect(404)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Review Not Found.')
    })
  })

  test('POST - status 400 - the review_id is invalid (non-numeric).', () => {
    return request(app)
        .post('/api/reviews/non-sense/comments')
        .send({ username: "mallionaire", body: "Good, very good!" })
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Bad Request.')
    })
  })
})

//test is amended for ticket 8
describe('PATCH /api/reviews/:review_id test suite', () => {
  test('returns 200 OK with updated review', () => {
    const testReview = { inc_votes : 0 };
    return request(app).patch('/api/reviews/2').send(testReview).expect(200)
    .then(({body}) => {
      const updatedReview = body.review[0];

      expect(updatedReview.review_id).toEqual(2)
      expect(typeof updatedReview.title).toBe('string')
      expect(typeof updatedReview.category).toBe('string')
      expect(typeof updatedReview.designer).toBe('string')
      expect(typeof updatedReview.owner).toBe('string')
      expect(typeof updatedReview.review_body).toBe('string')
      expect(typeof updatedReview.review_img_url).toBe('string')
      expect(typeof updatedReview.created_at).toBe('string')
      expect(updatedReview.votes).toEqual(5)
      
    })
  })
  test('the votes of the updated review are changed correctly', () => {
    const testReview = { inc_votes : 10 };
    return request(app).patch('/api/reviews/2').send(testReview).expect(200)
    .then(({body}) => {
      const updatedReview = body.review[0];
      expect(updatedReview.review_id).toEqual(2)
      expect(typeof updatedReview.title).toBe('string')
      expect(typeof updatedReview.category).toBe('string')
      expect(typeof updatedReview.designer).toBe('string')
      expect(typeof updatedReview.owner).toBe('string')
      expect(typeof updatedReview.review_body).toBe('string')
      expect(typeof updatedReview.review_img_url).toBe('string')
      expect(typeof updatedReview.created_at).toBe('string')
      expect(updatedReview.votes).toEqual(15)
    })
  })
  test('the votes of the updated review are changed correctly', () => {
    const testReview = { inc_votes : -10 };
    return request(app).patch('/api/reviews/2').send(testReview).expect(200)
    .then(({body}) => {
      const updatedReview = body.review[0];
      expect(updatedReview.review_id).toEqual(2)
      expect(typeof updatedReview.title).toBe('string')
      expect(typeof updatedReview.category).toBe('string')
      expect(typeof updatedReview.designer).toBe('string')
      expect(typeof updatedReview.owner).toBe('string')
      expect(typeof updatedReview.review_body).toBe('string')
      expect(typeof updatedReview.review_img_url).toBe('string')
      expect(typeof updatedReview.created_at).toBe('string')
      expect(updatedReview.votes).toEqual(0)
    })
  })
  test('GET - status 404 - invalid review id will respond with not found.', () => {
    return request(app).get('/api/reviews/9999').expect(404).then(({body}) => {
            expect(body.msg).toBe('Review Not Found.')
        })
  });
})


//test is amended for ticket 9
describe('DELETE /api/comments/:comment_id test suite', () => {
  test('returns 204 no content status', () => {
      return request(app).delete('/api/comments/3').expect(204)
        .then(({body}) => {
          expect(body).toEqual({}) 
        })
  })
  test("returns 404 when passed comment id does not exist", () => {
    return request(app).delete("/api/comments/99999").expect(404)
      .then(({body}) => {
        const {msg} = body;
        expect(msg).toBe('No comment found with id: 99999')
      });
  });
  test('DELETE - status 400 - invalid comment_id', () => {
    return request(app).delete('/api/comments/non-sense').expect(400)
      .then(({body}) => {
        const {msg} = body;
        expect(msg).toBe('Bad Request.')
      })
  })
})
