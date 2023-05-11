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

  test('GET - /api/nonsense returns 404 error msg ', () => {
      return request(app).get('/api/huhgfeame').expect(404).then((res) => {
          expect(res.body.msg).toBe('Bad Request.')
      })
  })
})

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
          console.log(body.Review);
          const {reviews} = body;
            expect( body.Review ).toBeSortedBy('created_at', { descending: true })
        })
})
  

  

})
